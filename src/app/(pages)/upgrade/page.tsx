import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UpgradePageContent } from "./upgrade-page-content";
import { MainContentRow } from "@/components/main-content-row";
import { createCheckoutSession } from "@/lib/stripe";
import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { PageHeader } from "@/components/page-header";
import { PageFrame } from "@/components/pageframe";
import { NavSideBar } from "@/components/navbars/nav-side-bar";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const UpgradePage = async ({ searchParams }: PageProps) => {
  const auth = await currentUser();
  const navItems = [
  {
    label: "Home",
    href: "/home",
    tooltip: "Go home - test menu item only",
  },
];;


  if (!auth) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    return redirect("/welcome");
  }

  const { success, intent } = await searchParams;

  if (intent === "upgrade") {
    if (!user.externalId) {
      throw new Error("User external ID is null");
    }

    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.externalId,
    });

    if (session.url) redirect(session.url);
  }

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="Upgrade" userId={user.id}  navItems={navItems}>
        {success && <PaymentSuccessModal />}
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="Upgrade" userId={user.id} />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Home" />
            <MainContentRow>
              <div className="flex justify-center w-full pt-24 min-h-full">
                <UpgradePageContent plan={user.plan} />
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
};

export default UpgradePage;


