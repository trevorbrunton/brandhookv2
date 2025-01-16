"use client";
import { useState, useEffect, useCallback } from "react";
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
import { RUSureDialog } from "@/components/r-u-sure-dialog";


interface SelectButtonProps {
  projectId: string;
}

export function ActionsButton({ projectId }: SelectButtonProps) {
  const [open, setOpen] = useState(false);
  const [doIt, setDoIt] = useState(false);
  const router = useRouter();

  // Open Warning Dialog
  const warning = () => {
    setOpen(true);
  };

  // Get Return Value from Warning Dialog
  const registerReturnValue = (value: boolean) => {
    setDoIt(value);
    setOpen(false);
  };
  // Called from UseEffect to get accurate value of doIt
  const zapProject = useCallback(
    async (projectId: string) => {
      if (doIt) {
        console.log("Deleting project: ", projectId);
        const result = await deleteProject(projectId);
        if (result.success) {
          console.log("Project deleted: ", projectId);
        } else {
          console.error("Project not deleted: ", projectId);
        }
      } else {
        console.log("Not deleting project: ", projectId);
      }
    },
    [doIt]
  );

 // Call zapProject when doIt changes
  useEffect(() => {
    zapProject(projectId);
    console.log("return value: ", doIt);
  }, [doIt, zapProject, projectId]);

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
            <Button
              variant="ghost"
              onClick={() => {
                warning();
              }}
            >
              Delete Project
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RUSureDialog
        open={open}
        setOpen={setOpen}
        registerReturnValue={registerReturnValue}
      />
  </>
  );
}
