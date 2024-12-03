import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";


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

export default async function Dashboard({ searchParams }: PageProps) {
  const auth = await currentUser();
  const { theParams } = await searchParams;
  console.log("searchParams", theParams);
  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }
  //check if user has user profile
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });
  console.log("USER IN DB:", user);

  if (!user) {
    return redirect("/welcome");
  }

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="home" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="home" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Home" />
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
