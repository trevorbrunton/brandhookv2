"use client";

import { deleteDocument } from "@/app/actions/delete-document";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

interface SelectButtonProps {
  projectId: string;
  documentId?: string;
}

export function DocActionsButton({ projectId, documentId }: SelectButtonProps) {
  const queryClient = useQueryClient();

  return (
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
              const result = await deleteDocument(documentId!, projectId);
              if (result?.error) {
                console.error(result.error);
              }
              queryClient.invalidateQueries({
                queryKey: ["documents", projectId],
              });
            }}
          >
            Delete Document
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
