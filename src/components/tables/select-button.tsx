"use client";
import { Button } from "@/components/ui/button";
import { useCurrentProject } from "@/state/use-current-project";
import { useRouter } from "next/navigation";

interface SelectButtonProps {
  projectId: string;
}

export function SelectButton({ projectId }: SelectButtonProps) {
  const { setCurrentProjectId} = useCurrentProject();
  const router = useRouter();

  return (
    <Button
    size="sm"
      onClick={() => {
        setCurrentProjectId(projectId);
        router.push(`/project-view/${encodeURIComponent(projectId)}`);
      }}
    >
      Select
    </Button>
  );
}
