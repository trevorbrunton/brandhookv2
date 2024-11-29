"use client";
import { MenuContent } from "@/components/navbars/menu-content";


export function NavSideBar() {
  return (
    <aside className=" hidden w-full flex-col sm:flex mb-2  px-4">
      <MenuContent onLinkClick={() => {}} />
    </aside>
  );
}
