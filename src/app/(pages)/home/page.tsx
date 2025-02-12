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

  // async function callLambdaFunction() {
  //   const lambdaUrl =
  //     "https://6ptcqrh5c4dnmx7mhb3s7u7qdu0cxhhk.lambda-url.ap-southeast-2.on.aws/";
  //   const payload = {
  //     fileName: "audio_file.mp3",
  //     fileType: "audio/mpeg",
  //     url: "https://example.com/path/to/audio_file.mp3",
  //   };

  //   try {
  //     const response = await fetch(lambdaUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Lambda response:", data);
  //     return data;
  //   } catch (error) {
  //     console.error("Error calling Lambda function:", error);
  //     throw error;
  //   }
  // }

  // callLambdaFunction();

  return (
    <div className="flex w-full flex-col ">
      <PageFrame page="home" userId={user.id} navItems={navItems}>
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
