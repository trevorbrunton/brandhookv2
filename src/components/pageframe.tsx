"use client";
import { ReactNode, useState } from "react";
import { Navbar } from "@/components/navbars/navbar";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { MenuContent } from "@/components/navbars/menu-content";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface PageFrameProps {
  children: ReactNode;
  page: string;
}

export const PageFrame = ({ children, page }: PageFrameProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };
  return (
    <>
      <>
        <div className="hidden sm:block">
          <Navbar />
        </div>
        <MaxWidthWrapper>
          <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:hidden">
            <p className="text-lg font-semibold">
              <span className="text-brand-700">cronicle</span>
            </p>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pt-20 sm:max-w-xs">
                <MenuContent onLinkClick={handleLinkClick} page={page} />
              </SheetContent>
            </Sheet>
          </div>
          {children}
        </MaxWidthWrapper>
      </>
    </>
  );
};
