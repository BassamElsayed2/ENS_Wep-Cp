// app/(protected)/layout.tsx
import LayoutProvider from "@/providers/LayoutProvider";
import ProtectedLayoutWrapper from "@/components/ProtectedLatout";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayoutWrapper>
      <LayoutProvider>
        {children}
        <Toaster />
      </LayoutProvider>
    </ProtectedLayoutWrapper>
  );
}
