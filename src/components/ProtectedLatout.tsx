"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "./Authentication/useUser";
import { useRouter } from "next/navigation";
import loading from "@/app/loading";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { isPending, isAuthanticated } = useUser();

  useEffect(() => {
    if (!isAuthanticated && !isPending && !isRedirecting) {
      setIsRedirecting(true);
      router.replace("/");
    }
  }, [isAuthanticated, isPending, isRedirecting, router]);

  if (isPending) return loading();

  if (!isAuthanticated) return null;

  return <>{children}</>;
}
