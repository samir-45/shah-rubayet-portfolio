import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "image";
  placeholder?: string;
  rows?: number;
};

export type ListItem = Record<string, any> & { id: number; sortOrder: number; published: boolean };

type Props<T extends ListItem> = {
  title: string;
  description?: string;
  items: T[] | undefined;
  fields: FieldDef[];
  /** Default form values for "new" */
  defaults: Record<string, any>;
  /** How to render the row content (left of action buttons) */
  renderRow: (item: T) => React.ReactNode;
  onCreate: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function SimpleListEditor<T extends ListItem>({
  title,
  description,
  items,
  fields,
  defaults,
  renderRow,
  onCreate,
  onUpdate,
  onDelete,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ ...defaults, sortOrder: 0, published: true });
  const [busy, setBusy] = useState(false);

  function openNew() {
    setForm({ ...defaults, sortOrder: items?.length ?? 0, published: true });
    setOpen(true);
  }
  function openEdit(item: T) {
    const f: any = { id: item.id, sortOrder: item.sortOrder, published: item.published };
    for (const fd of fields) f[fd.key] = item[fd.key];
    setForm(f);
    setOpen(true);
  }

  async function save() {
    setBusy(true);
    try {
      const payload: any = { sortOrder: Number(form.sortOrder) || 0, published: !!form.published };
      for (const fd of fields) {
        const v = form[fd.key];
        payload[fd.key] = fd.type === "number" ? Number(v) || 0 : v ?? "";
      }
      if (form.id) await onUpdate(form.id, payload);
      else await onCreate(payload);
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          ) : null}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="size-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{form.id ? `Edit ${title.replace(/s$/, "").toLowerCase()}` : `New ${title.replace(/s$/, "").toLowerCase()}`}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4">
              {fields.map(fd => (
                <div key={fd.key} className="flex flex-col gap-1.5">
                   <Label className="text-xs uppercase tracking-wider text-muted-foreground">{fd.label}</Label>
                  {fd.type === "image" ? (
                    <ImageUploader
                      value={form[fd.key] ?? null}
                      onChange={url => setForm((f: any) => ({ ...f, [fd.key]: url }))}
                      folder={title.toLowerCase()}
                    />
                  ) : fd.type === "textarea" ? (
                    <Textarea
                      rows={fd.rows ?? 3}
                      placeholder={fd.placeholder}
                      value={form[fd.key] ?? ""}
                      onChange={e => setForm((f: any) => ({ ...f, [fd.key]: e.target.value }))}
                    />
                  ) : (
                    <Input
                      type={fd.type === "number" ? "number" : "text"}
                      placeholder={fd.placeholder}
                      value={form[fd.key] ?? ""}
                      onChange={e => setForm((f: any) => ({ ...f, [fd.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sort order</Label>
                  <Input
                    type="number"
                    value={form.sortOrder ?? 0}
                    onChange={e => setForm((f: any) => ({ ...f, sortOrder: e.target.value }))}
                  />
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <Switch
                    checked={!!form.published}
                    onCheckedChange={v => setForm((f: any) => ({ ...f, published: v }))}
                  />
                  <Label>Published</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                {form.id ? "Save changes" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex flex-col gap-3">
        {(items ?? []).map(item => (
          <Card key={item.id} className={!item.published ? "opacity-60" : ""}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">{renderRow(item)}</div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={async () => {
                    if (!confirm("Delete this item?")) return;
                    try {
                      await onDelete(item.id);
                      toast.success("Deleted");
                    } catch (e: any) {
                      toast.error(e?.message ?? "Failed");
                    }
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here yet. Add your first one.</p>
        ) : null}
      </div>
    </div>
  );
}
