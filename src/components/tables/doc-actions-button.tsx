"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/app/actions/delete-document";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { deleteProject } from "@/app/actions/delete-project";
import { RUSureDialog } from "@/components/r-u-sure-dialog";
import { set } from "date-fns";

interface SelectButtonProps {
  projectId: string;
  documentId?: string;
}

export function DocActionsButton({ projectId, documentId }: SelectButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  return (
    <TooltipProvider>
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
              onClick={async () => {
                setIsDeleting(true);
                const result = await deleteDocument(documentId!, projectId);
                if (result.error) {
                  console.error(result.error);
                }
                setIsDeleting(false);
              }}
            >
              {" "}
              Delete Document
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant="ghost"
              onClick={() => {
                alert("I'm not implemented yet");
              }}
            >
              Download Document
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
