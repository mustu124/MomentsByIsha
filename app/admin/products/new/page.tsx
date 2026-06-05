import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <AdminGuard>
      <AdminShell title="New product">
        <ProductForm />
      </AdminShell>
    </AdminGuard>
  );
}
