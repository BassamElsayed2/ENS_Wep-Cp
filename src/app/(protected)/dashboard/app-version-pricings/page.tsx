import type { Metadata } from "next";
import AppVersionPricingsManagement from "@/components/AppVersionPricings/AppVersionPricingsManagement";

export const metadata: Metadata = {
  title: "إدارة أسعار الإصدارات البرمجية - ENS",
  description:
    "إدارة أسعار الإصدارات البرمجية لتطبيقات الأخبار والعقارات والمتجر",
};

export default function AppVersionPricingsPage() {
  return (
    <>
      <AppVersionPricingsManagement />
    </>
  );
}
