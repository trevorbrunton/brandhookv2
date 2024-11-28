import { MenuContent } from "@/components/navbars/menu-content";


export function NavSideBar() {
  return (
    <aside className=" hidden w-42 flex-col sm:flex mb-2 ">
      <MenuContent />
    </aside>
  );
}
