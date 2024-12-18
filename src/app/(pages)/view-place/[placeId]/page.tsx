import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import { PlaceDialog } from "@/components/dialogs/create-place-record";
import { PlaceDetailsForm } from "./place-details-form";
import { GoBackButton } from "@/components/go-back-button";

type PageProps = {
  params: Promise<{
    placeId: string;
  }>;
};

export default async function ViewPlace({ params }: PageProps) {
  const auth = await currentUser();
  const { placeId } = await params;

  if (placeId === "new") {
    return <PlaceDialog />;
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

  const place = await db.place.findFirst({
    where: { id: placeId },
  });

  if (!place) {
    return <p>Place fetch failed</p>;
  }

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="place" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="place" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader
              title={`Place Details: ${place?.name ?? "New Place"}`}
            />
            <MainContentRow>
              <div className="flex flex-col md:flex-row items-start justify-start w-full min-h-full p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col items-center space-y-6 md:w-1/3">
                  {place && (
                    <div className="w-full flex justify-center">
                      <img
                        src={place.picUrl || "/placeholder-place.jpg"}
                        alt={place.name}
                        className="w-48 md:w-72 rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  <GoBackButton />
                </div>
                <div className="flex flex-col items-center md:items-start justify-start w-full md:w-2/3 space-y-6">
                  <PlaceDetailsForm
                    initialData={{
                      ...place,
                      geolocation: place?.geolocation ?? undefined,
                      picUrl: place?.picUrl ?? undefined,
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

