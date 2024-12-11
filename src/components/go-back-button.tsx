"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoBackButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className="flex items-center space-x-2 w-24"
    >
      <ArrowLeft />
      <span>Back</span>
    </Button>
  );
}
