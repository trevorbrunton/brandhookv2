"use client";
import { ReactNode, useState } from "react";
import { Navbar } from "@/components/navbars/navbar";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { MenuContent } from "@/components/navbars/menu-content";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/components/navbars/navbar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";

interface PageFrameProps {
  children: ReactNode;
  page: string;
  navItems: NavItem[] | null; 
}

export const PageFrame = ({ children, page,navItems }: PageFrameProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };
  return (
    <>
      <>
        <div className="hidden sm:block">
          <Navbar navItems={navItems} />
        </div>
        <MaxWidthWrapper>
          <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:hidden">
           <img src="/brandhook.png" alt="Brandhook" className="h-12 w-auto"/>
            <div className="h-full flex items-center space-x-4">
              <TooltipProvider>
                {navItems &&
                  navItems.map((item) => (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs z-999"
                          onClick={() => {
                            router.push(item.href);
                            router.refresh();
                          }}
                        >
                          {item.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={16}>
                        {item.tooltip}{" "}
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </TooltipProvider>
              <SignOutButton>
                <Button size="sm" variant="ghost">
                  Sign out
                </Button>
              </SignOutButton>
              <UserButton
                showName={false}
                appearance={{
                  elements: {
                    userButtonBox: "flex-row-reverse",
                  },
                }}
              />
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
          </div>
          {children}
        </MaxWidthWrapper>
      </>
    </>
  );
};
