

"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react"; // Changed from Ellipsis for better clarity
import { deleteProject } from "@/app/actions/delete-project";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast"; // Assuming you have toast component

interface ActionsButtonProps {
  projectId: string;
  projectName: string; // Added for better UX in confirmation
}

export function ActionsButton({ projectId, projectName }: ActionsButtonProps) {


  const queryClient = useQueryClient();

  const handleDeleteConfirm = async () => {

    try {
      const result = await deleteProject(projectId);
      
      if (!result || !result.error) {
        await queryClient.invalidateQueries({ queryKey: ["all_projects"] });
        toast({
          title: "Success",
          description: `Project "${projectName}" has been deleted.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete project: ${(error as Error).message}`,
        variant: "destructive",
      });

    }
  };

  return (

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
           
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => console.log("Edit project details")}
            >
              Edit Project Details
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteConfirm()}
             
            >
              Delete Project
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

  );
}