"use client";
import {
  Dialog,

  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";

interface NotImplementedDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  registerReturnValue: (value: boolean) => void;
}

import { Button } from "@/components/ui/button";

export function RUSureDialog({
  open,
  setOpen,
  registerReturnValue,
}: NotImplementedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-400">Warning</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <DialogDescription>
              Are you sure you want to do this? This action can&apos;t be
              undone!
            </DialogDescription>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">

            <Button
              type="button"
              variant="secondary"
              onClick={() => registerReturnValue(true)}
            >
              Yes, do it
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => registerReturnValue(false)}
            >
              No, cancel
            </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
