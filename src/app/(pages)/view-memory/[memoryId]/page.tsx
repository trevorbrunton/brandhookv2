import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";

import { MemoryDetailsForm } from "./memory-details-form";


import { GoBackButton } from "@/components/go-back-button";

type PageProps = {
  params: Promise<{
    memoryId: string;
  }>;
};

export default async function ViewMemory({ params }: PageProps) {
  const auth = await currentUser();
  const { memoryId } = await params;

  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }

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
  const memory = await db.memory.findFirst({
    where: { id: memoryId },
  });
  if (!memory) {
    return <p> Collection fetch failed </p>;
  }
//get allPeople
  const people = await db.person.findMany({
    where: { userId: user.id },
  });

  const formattedPeople = people.map(person => ({
    label: person.name,
    value: person.name,
    personId: person.id,
  }));

  //get allEvents
  const events = await db.event.findMany({
    where: { userId: user.id },
  });

  const formattedEvents = events.map(event => ({
    label: event.name,
    value: event.name,
    eventId: event.id,
  }));

  //get allPlaces

  const places = await db.place.findMany({
    where: { userId: user.id },
  });

  const formattedPlaces = places.map(place => ({
    label: place.name,
    value: place.name,
    placeId: place.id,
  }));

  //get names of selected people for display in memory-details-form
  const selectedPeople = memory.people.map((person) => {
    const foundPerson = formattedPeople.find((p) => p.personId === person);
    return foundPerson ? foundPerson.value : "";
  });

  //get name of selected event and place for display in memory-details-form
  const selectedEvent = formattedEvents.find((e) => e.eventId === memory.event);
  const selectedPlace = formattedPlaces.find((p) => p.placeId === memory.place);

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="memory" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="memory" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title={`Memory Details: ${memory.title}`} />
            <MainContentRow>
              <div className="flex flex-col md:flex-row items-start justify-start w-full min-h-full p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col items-center space-y-6 md:w-1/3">
                  {memory && (
                    <div>
                      <img
                        src={memory.fileUrl ? memory.fileUrl : ""}
                        alt={memory.title}
                        className="w-72"
                      />
                    </div>
                  )}

                  <GoBackButton />
                </div>
                <div className="flex flex-col items-center md:items-start justify-start w-full md:w-2/3 space-y-6">
                  <MemoryDetailsForm
                    initialData={{
                      place: selectedPlace? selectedPlace.value : "",

                      title: memory.title,
                      people: selectedPeople,
                      event: selectedEvent? selectedEvent.value : "",
                      id: memory.id,
                      userId: memory.userId
                    }}
                    allPeople={formattedPeople}
                    allEvents={formattedEvents}
                    allPlaces={formattedPlaces}
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
