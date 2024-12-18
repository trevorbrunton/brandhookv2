import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import { EventDialog } from "@/components/dialogs/create-event-record";
import { EventDetailsForm } from "./event-details-form";
import { GoBackButton } from "@/components/go-back-button";

type PageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function ViewEvent({ params }: PageProps) {
  const auth = await currentUser();
  const { eventId } = await params;

  if (eventId === "new") {
    return <EventDialog />;
  }

  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }

  //check if user has user profile
  const user = await db.user.findUnique({
    where: { externalId: auth?.id ?? "" },
  });

  if (!user) {
    return redirect("/welcome");
  }

  const event = await db.event.findFirst({
    where: { id: eventId },
  });

  if (!event) {
    return <p>Event fetch failed</p>;
  }

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="event" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="event" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader
              title={`Event Details: ${event?.name ?? "New Event"}`}
            />
            <MainContentRow>
              <div className="flex flex-col md:flex-row items-start justify-start w-full min-h-full p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col items-center space-y-6 md:w-1/3">
                  {event && (
                    <div className="w-full flex justify-center">
                      <img
                        src={event.picUrl || "/placeholder-event.jpg"}
                        alt={event.name}
                        className="w-48 md:w-72 rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  <GoBackButton />
                </div>
                <div className="flex flex-col items-center md:items-start justify-start w-full md:w-2/3 space-y-6">
                  <EventDetailsForm
                    initialData={{
                      ...event,
                      dateOfEvent: event?.dateOfEvent ?? undefined,
                      picUrl: event?.picUrl ?? undefined,
                    }}
                  />
                </div>
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}

