"use client";
import { MenuContent } from "@/components/navbars/menu-content";
interface NavSideBarProps {
  page: string;
}

export function NavSideBar({ page }: NavSideBarProps) {
  return (
    <aside className=" hidden w-full flex-col sm:flex mb-2  px-4">
      <MenuContent onLinkClick={() => {}} page={page} />
    </aside>
  );
}
