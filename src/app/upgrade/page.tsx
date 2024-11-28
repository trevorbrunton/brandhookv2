
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UpgradePageContent } from "./upgrade-page-content";


import { createCheckoutSession } from "@/lib/stripe";
import { PaymentSuccessModal } from "@/components/payment-success-modal";



type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

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
    <div className="w-full">
      {success && <PaymentSuccessModal />}


<UpgradePageContent plan={user.plan} />
  

   

    </div>
  );
};

export default Page;
