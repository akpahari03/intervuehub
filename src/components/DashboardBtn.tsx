"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

function DasboardBtn() {
  const { isCandidate, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={"/dashboard"}>
      <Button className="gap-2 font-medium glass-subtle border-0 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-300 ripple glow-blue" size={"sm"}>
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}

export default DasboardBtn;