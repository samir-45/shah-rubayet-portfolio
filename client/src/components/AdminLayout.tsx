import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  Award,
  ExternalLink,
  Hammer,
  Inbox,
  LayoutDashboard,
  Link2,
  ListChecks,
  LogOut,
  MessageSquareQuote,
  Sparkles,
  SquareKanban,
  User,
  Wrench,
} from "lucide-react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import LoginForm from "./LoginForm";

const menu = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: User, label: "Profile & Hero", path: "/admin/profile" },
  { icon: SquareKanban, label: "Projects", path: "/admin/projects" },
  { icon: Award, label: "Certifications", path: "/admin/certifications" },
  { icon: Sparkles, label: "Services", path: "/admin/services" },
  { icon: ListChecks, label: "Process", path: "/admin/process" },
  { icon: Hammer, label: "Skills", path: "/admin/skills" },
  { icon: Wrench, label: "Tools", path: "/admin/tools" },
  { icon: MessageSquareQuote, label: "Testimonials", path: "/admin/testimonials" },
  { icon: Link2, label: "Social Links", path: "/admin/social" },
  { icon: Inbox, label: "Messages", path: "/admin/messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <LoginForm />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Not authorized</h1>
          <p className="text-sm text-muted-foreground">
            You're signed in as <strong>{user.name || user.email}</strong>, but this dashboard is restricted to the
            project owner.
          </p>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to site</Button>
        </div>
      </div>
    );
  }

  const active = menu.find(m => m.path === location);

  return (
    <SidebarProvider style={{ "--sidebar-width": "260px" } as React.CSSProperties}>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="h-16 px-4 flex items-center">
          <div className="flex items-center gap-2 pt-5">
            <span className="font-semibold tracking-tight truncate">Portfolio Admin Dashboard</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-2 py-1">
            {menu.map(item => {
              const isActive = location === item.path;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => setLocation(item.path)}
                    tooltip={item.label}
                    className="h-10"
                  >
                    <item.icon className={`size-4 ${isActive ? "text-primary" : ""}`} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          <div className="px-3 mt-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/40"
            >
              <ExternalLink className="size-3.5" /> View live site
            </a>
          </div>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left">
                <Avatar className="size-9 border">
                  <AvatarFallback className="text-xs font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium truncate leading-none">{user.name || "-"}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1.5">{user.email || "-"}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={async () => {
                  try {
                    await logout();
                  } finally {
                    window.location.href = "/";
                  }
                }}
              >
                <LogOut className="mr-2 size-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center gap-2 px-2 sticky top-0 bg-background/95 backdrop-blur z-40">
            <SidebarTrigger className="h-9 w-9 rounded-lg" />
            <span className="text-sm">{active?.label ?? "Admin"}</span>
          </div>
        )}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
