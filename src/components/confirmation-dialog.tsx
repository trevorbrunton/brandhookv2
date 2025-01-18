import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  destructive?: boolean;
  disabled?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  destructive = false,
  disabled = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!disabled) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={disabled}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={
              destructive ? "bg-red-600 text-white hover:bg-red-700" : ""
            }
            disabled={disabled}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
