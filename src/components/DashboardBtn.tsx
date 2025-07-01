"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboardIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

function DasboardBtn() {
  const { isCandidate, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={"/dashboard"}>
      <Button variant="outline" size="sm" className="gap-2 h-10 text-sm rounded-xl border-border/60 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
        <LayoutDashboardIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}

export default DasboardBtn;