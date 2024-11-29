
import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
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

export default async function SettingsPage() {
const Page = async ({ searchParams }: PageProps) => {
  const auth = await currentUser();
  const { theParams } = await searchParams;
  console.log("searchParams", theParams);

  if (!auth) {
    redirect("/sign-in");
  }
  //check if user has user profile  
  // const userProfile = await createUserProfile();
  // if (userProfile.success == "newUser") {
  //   redirect("/settings");  //DEVNOTE - use query params to pass return page
}
  
  console.log("Page", Page);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">

      <div className="flex flex-row flex-auto">
        <div className="flex flex-col flex-auto">
          <PageHeader title="Account Settings" />
          <MainContentRow>
              <div className="flex justify-center w-full pt-24">main content goes here</div>
          </MainContentRow>
        </div>
      </div>
    </div>
  );
}
