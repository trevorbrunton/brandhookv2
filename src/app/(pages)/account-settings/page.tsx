
import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { PageFrame } from "@/components/pageframe";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};




// import { LoadingSpinner } from "@/components/loading-spinner";
// import { createUserProfile} from "@/app/actions/create-user-profile";

// const navItems = [
//   {
//     label: "New Circular Initiative +",
//     href: `/project-details/${nanoid()}`,
//     tooltip: "Create a new circular initiative",
//   },
// ];

export default async function SettingsPage({ searchParams }: PageProps) {

    const auth = await currentUser();
    const { theParams } = await searchParams;
    console.log("searchParams", theParams);
    const navItems = null;

    if (!auth) {
      redirect("/sign-in");
    }
    //check if user has user profile
    // const userProfile = await createUserProfile();
    // if (userProfile.success == "newUser") {
    //   redirect("/settings");  //DEVNOTE - use query params to pass return page
  



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
                main content goes here
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}

