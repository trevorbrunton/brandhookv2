import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";

import { ProjectTable } from "@/components/tables/project-table";

export default async function Home() {
  const auth = await currentUser();

  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }
  //check if user has user profile
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });


  if (!user) {
    return redirect("/welcome");
  }


  return (
    <div className="flex w-full flex-col ">
      <PageFrame page="home" userId={user.id} navItems={navItems} projectId="">
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="home" userId={user.id} projectId="" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Home" />
            <MainContentRow>
              <ProjectTable />
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
