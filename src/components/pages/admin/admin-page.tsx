import { getTranslations } from "next-intl/server";
import { AdminDashboard } from "@/components/pages/admin/components/admin-dashboard/admin-dashboard";
import { Button } from "@/components/shared/ui/button";
import { Link } from "@/helpers/i18n/routing";
import styles from "./admin-page.module.css";

export async function AdminPage() {
  const t = await getTranslations("pages.admin");

  return (
    <section className={styles.page}>
      <div>
        <h1 className={styles.title}>{t("dashboardTitle")}</h1>
        <p className={styles.description}>{t("dashboardDescription")}</p>
      </div>
      <div className={styles.actions}>
        <Button render={<Link href="/admin/products" />}>
          {t("goToProducts")}
        </Button>
        <Button variant="outline" render={<Link href="/admin/products/new" />}>
          {t("createProduct")}
        </Button>
      </div>
      <AdminDashboard />
    </section>
  );
}
