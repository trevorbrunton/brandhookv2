import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { PageFrame } from "@/components/pageframe";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { db } from "@/db";

export default async function SettingsPage() {
  const auth = await currentUser();
  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    return redirect("/welcome");
  }

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="Account Settings" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="Account Settings" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Account Settings" />
            <MainContentRow>
              <div className="flex justify-center w-full pt-24 min-h-full">
                <SettingsForm
                  userId={user.id}
                  businessDetails={user.businessDetails || ""}
                  businessStage={user.businessStage || ""}
                  marketChannel={user.marketChannel || ""}
                />
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
