import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UpgradePageContent } from "./upgrade-page-content";
import { MainContentRow } from "@/components/main-content-row";
import { createCheckoutSession } from "@/lib/stripe";
import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { PageHeader } from "@/components/page-header";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const auth = await currentUser();

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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
          {success && <PaymentSuccessModal />}

      <div className="flex flex-row flex-auto">
        <div className="flex flex-col flex-auto">
          <PageHeader title="Upgrade your plan" />
          <MainContentRow>
            <div className="flex justify-center w-full pt-24">
              <UpgradePageContent plan={user.plan} />
              </div>
          </MainContentRow>
        </div>
      </div>
    </div>

  );
};

export default Page;
