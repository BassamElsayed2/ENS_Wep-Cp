// app/(protected)/ProtectedWrapper.tsx
"use client";

import { ReactNode } from "react";

export default function ProtectedWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
