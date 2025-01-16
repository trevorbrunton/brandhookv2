"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { deleteProject } from "@/app/actions/delete-project";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

interface SelectButtonProps {
  projectId: string;
}

export function ActionsButton({ projectId }: SelectButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteConfirm = useCallback(async () => {
    console.log("Deleting project: ", projectId);
    const result = await deleteProject(projectId);
    if (result.success) {
      console.log("Project deleted: ", projectId);
      // Optionally, you can refresh the page or navigate away
      // router.refresh(); // If you want to refresh the current page
      // router.push('/projects'); // If you want to navigate to a projects list page
    } else {
      console.error("Project not deleted: ", projectId);
      // Optionally, you can show an error message to the user
    }
  }, [projectId]);

  const handleDeleteCancel = useCallback(() => {
    console.log("Deletion cancelled for project: ", projectId);
  }, [projectId]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link">
            <Ellipsis className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant="ghost"
              onClick={() =>
                router.push(`/project-details/${encodeURIComponent(projectId)}`)
              }
            >
              Edit Project Details
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="ghost" onClick={() => setOpen(true)}>
              Delete Project
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Yes, delete project"
        cancelText="No, keep project"
        destructive={true}
      />
    </>
  );
}
