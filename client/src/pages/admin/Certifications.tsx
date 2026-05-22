import AdminLayout from "@/components/AdminLayout";
import SimpleListEditor from "@/components/admin/SimpleListEditor";
import { trpc } from "@/lib/trpc";

export default function AdminCertifications() {
  const utils = trpc.useUtils();
  const list = trpc.portfolio.listCertifications.useQuery({ includeDrafts: true });
  const createMut = trpc.portfolio.createCertification.useMutation({
    onSuccess: () => utils.portfolio.listCertifications.invalidate(),
  });
  const updateMut = trpc.portfolio.updateCertification.useMutation({
    onSuccess: () => utils.portfolio.listCertifications.invalidate(),
  });
  const deleteMut = trpc.portfolio.deleteCertification.useMutation({
    onSuccess: () => utils.portfolio.listCertifications.invalidate(),
  });

  return (
    <AdminLayout>
      <SimpleListEditor
        title="Certifications"
        description="Certifications shown on the public portfolio. Upload a badge/logo image and optionally link to a credential verification URL."
        items={list.data}
        defaults={{
          title: "",
          issuer: "",
          issueDate: "",
          credentialId: "",
          credentialUrl: "",
          imageUrl: "",
          description: "",
        }}
        fields={[
          { key: "title", label: "Certification title", type: "text", placeholder: "AWS Certified Developer" },
          { key: "issuer", label: "Issuing organization", type: "text", placeholder: "Amazon Web Services" },
          { key: "issueDate", label: "Issue date", type: "text", placeholder: "Jan 2025" },
          { key: "credentialId", label: "Credential ID (Optional)", type: "text", placeholder: "ABC123XYZ" },
          { key: "credentialUrl", label: "Verify URL (Optional)", type: "text", placeholder: "https://www.credly.com/badges/..." },
          { key: "imageUrl", label: "Badge / Logo Image (Optional)", type: "image" },
          { key: "description", label: "Short description (Optional)", type: "textarea", rows: 2, placeholder: "Brief note about this certification…" },
        ]}
        renderRow={c => (
          <div className="flex items-center gap-4">
            {c.imageUrl ? (
              <img
                src={c.imageUrl}
                alt=""
                className="size-10 rounded-lg object-contain bg-card border border-border p-1 shrink-0"
              />
            ) : (
              <div className="size-10 rounded-lg border border-border bg-card grid place-items-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M12 15l-2 5-6-6 5-2m5 2l2 5 6-6-5-2M8.5 8.5l7 7M12 2a5 5 0 015 5" />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{c.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {c.issuer}{c.issueDate ? ` · ${c.issueDate}` : ""} · order {c.sortOrder} · {c.published ? "Published" : "Draft"}
              </div>
              {c.credentialId && (
                <div className="text-xs text-muted-foreground/70 mt-0.5 font-mono">ID: {c.credentialId}</div>
              )}
            </div>
          </div>
        )}
        onCreate={async (d: any) => {
          await createMut.mutateAsync(d);
        }}
        onUpdate={async (id, d: any) => {
          await updateMut.mutateAsync({ id, ...d });
        }}
        onDelete={async id => {
          await deleteMut.mutateAsync({ id });
        }}
      />
    </AdminLayout>
  );
}
