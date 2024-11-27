import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageContent } from "./dashboard-page-content";
import { CreateEventCategoryModal } from "@/components/create-event-category-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
    <>
      {success && <PaymentSuccessModal />}

      <DashboardPage
        cta={
          <CreateEventCategoryModal>
            <Button variant="outline" className="w-full sm:w-fit">
              <PlusIcon className="size-4 mr-2" />
              Add Category
            </Button>
          </CreateEventCategoryModal>
        }
        title="Dashboard"
      >
        <DashboardPageContent />
      </DashboardPage>
    </>
  );
};

export default Page;
