import type { Metadata } from "next";
import AppVersionServicesManagement from "@/components/AppVersionServices/AppVersionServicesManagement";

export const metadata: Metadata = {
  title: "إدارة الإصدارات البرمجية - ENS",
  description: "إدارة الإصدارات البرمجية لتطبيقات الأخبار والعقارات والمتجر",
};

export default function AppVersionServicesPage() {
  return (
    <>
      <AppVersionServicesManagement />
    </>
  );
}
