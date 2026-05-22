import { describe, expect, it, vi } from "vitest";
import { ENV } from "./_core/env";

// Ensure the cookie secret is set for JWT signing in tests
ENV.cookieSecret = "test_jwt_secret_value_that_is_long_enough_to_be_secure_and_valid";

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import { hashPassword } from "./utils/auth";
import { COOKIE_NAME } from "../shared/const";

type CookieCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

function createCtx(): { ctx: TrpcContext; setCookies: CookieCall[] } {
  const setCookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, setCookies };
}

describe("auth.login", () => {
  it("rejects when user does not exist", async () => {
    const spy = vi.spyOn(db, "getUserByUsername").mockResolvedValue(undefined);
    const { ctx } = createCtx();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({ username: "wronguser", password: "somepassword" })
    ).rejects.toThrow("Invalid username or password");

    expect(spy).toHaveBeenCalledWith("wronguser");
    spy.mockRestore();
  });

  it("rejects when password is wrong", async () => {
    const passwordHash = hashPassword("realpassword");
    const mockUser = {
      id: 1,
      openId: "admin",
      username: "admin",
      passwordHash,
      email: "admin@example.com",
      name: "Admin",
      loginMethod: "credentials",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const spy = vi.spyOn(db, "getUserByUsername").mockResolvedValue(mockUser);
    const { ctx } = createCtx();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({ username: "admin", password: "wrongpassword" })
    ).rejects.toThrow("Invalid username or password");

    expect(spy).toHaveBeenCalledWith("admin");
    spy.mockRestore();
  });

  it("authenticates and sets a session cookie on success", async () => {
    const passwordHash = hashPassword("correctpassword");
    const mockUser = {
      id: 1,
      openId: "admin",
      username: "admin",
      passwordHash,
      email: "admin@example.com",
      name: "Admin",
      loginMethod: "credentials",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const spy = vi.spyOn(db, "getUserByUsername").mockResolvedValue(mockUser);
    const { ctx, setCookies } = createCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({ username: "admin", password: "correctpassword" });

    expect(result.success).toBe(true);
    expect(result.user.username).toBe("admin");
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe(COOKIE_NAME);
    expect(setCookies[0]?.value).toBeDefined();
    expect(setCookies[0]?.options).toMatchObject({
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });

    spy.mockRestore();
  });
});
