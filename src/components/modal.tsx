"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Dispatch, ReactNode, SetStateAction } from "react";
// import { Drawer } from "vaul";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

// import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface ModalProps {
  children?: ReactNode;
  className?: string;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
}

export const Modal = ({
  children,
  className,
  desktopOnly,
  onClose,
  preventDefaultClose,
  setShowModal,
  showModal,
}: ModalProps) => {
  const closeModal = ({ dragged }: { dragged?: boolean }) => {
    if (preventDefaultClose && !dragged) {
      return;
    }

    if (onClose) {
      onClose();
    }

    if (setShowModal) {
      setShowModal(false);
    }
  };
  console.log(desktopOnly)

  const { isMobile } = useMediaQuery();

  // if (isMobile && !desktopOnly) {
  //   return (
  //     <Drawer
  //       open={setShowModal ? showModal : true}
  //       onOpenChange={(open: boolean) => {
  //         if (!open) {
  //           closeModal({ dragged: true });
  //         }
  //       }}
  //     >
  //       {/* <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" /> */}

  //       <DrawerContent
  //         // className={cn(
  //         //   "fixed !max-w-none top-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white ",
  //         //   className
  //         // )}
  //         className={cn("p-6 h-full",className)}
  //       >
  //         {/* <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit pt-10">
  //           {/* <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
  //         </div> */}

  //         {children}
  //       </DrawerContent>
  //     </Drawer>
  //   );
  // }

  return (
    <Dialog
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal({ dragged: true });
        }
      }}
    >
      <DialogTitle className="sr-only">Dialog</DialogTitle>
      <DialogContent
        className={cn("overflow-auto", { "h-full": isMobile }, className)}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

