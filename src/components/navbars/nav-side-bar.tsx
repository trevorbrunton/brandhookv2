"use client";
import { MenuContent } from "@/components/navbars/menu-content";
interface NavSideBarProps {
  page: string;
  userId: string
  projectId: string
}

export function NavSideBar({ page, userId, projectId }: NavSideBarProps) {
  const handleLinkClick = () => {
    console.log("Sidebar link clicked");  //DEV note - don't think i need this anymore but useful if I want to trap events.  but does it affect performance?
  };

  return (
    <aside className="hidden w-full flex-col sm:flex mb-2 px-4">
      <MenuContent onLinkClick={handleLinkClick} page={page} userId={userId} projectId={projectId} />
    </aside>
  );
}

