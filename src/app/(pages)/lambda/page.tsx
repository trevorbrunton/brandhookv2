import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
// import { transcribe} from "@/app/actions/transcribe";

export default async function Home() {
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

  // const display = await transcribe(user.id, "679d63b43228386fb953d667");
  // console.log(display)




  return (
    <div className="flex w-full flex-col ">
      <PageFrame page="home" userId={user.id} navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="home" userId={user.id} />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Home" />
            <MainContentRow>
              <span className="text-2xl font-bold">Success</span>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
