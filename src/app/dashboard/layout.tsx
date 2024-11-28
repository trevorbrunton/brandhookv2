"use client";





import { PropsWithChildren} from "react";
import { Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuContent } from "@/components/navbars/menu-content";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import {Menu} from "lucide-react";



const Layout = ({ children }: PropsWithChildren) => {


  return (
    <div className="relative h-screen flex flex-col md:flex-row overflow-hidden">

      <div className="hidden md:block w-52 border-r border-gray-100 p-4 h-full text-brand-900 relative z-10">
        <NavSideBar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <p className="text-lg/7 font-semibold text-brand-900">
            <span className="text-brand-700">cronicle</span>
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs pt-20">
              <div>
                <MenuContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* main content area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 shadow-md p-4 md:p-6 relative z-10">
          <div className="relative min-h-full flex flex-col">
            <div className="h-full flex flex-col flex-1 space-y-4">
              {children}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Layout;
