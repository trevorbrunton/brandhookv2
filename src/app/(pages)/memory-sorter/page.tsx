"use client";
import { useState } from "react";
import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";

import { NavSideBar } from "@/components/navbars/nav-side-bar";

import { PageFrame } from "@/components/pageframe";
import { CollectionSelector } from "@/components/collection-selector";
import { Collection, Memory } from "@prisma/client";

import { DNDCollection } from "@/components/dnd-collections";

export default function Home() {
  const navItems = null;
  const [collection1, setCollection1] = useState<Collection | null>(null);
  const [collection2, setCollection2] = useState<Collection | null>(null);
  const [memories1, setMemories1] = useState<Memory[]>([]);
  const [memories2, setMemories2] = useState<Memory[]>([]);

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="home" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="home" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Memory Sorter" />
            <MainContentRow>
              <div className="grid grid-cols-2 gap-16 py-4 mx-40">
                <div className="flex flex-col gap-4">
                  <CollectionSelector
                    setCollection={setCollection1}
                    setMemories={setMemories1}
                  />
                  {collection1 && collection1.collectionName}
                  {memories1.map((memory) => (
                    <div key={memory.id}>{memory.title}</div>
                  ))}
                </div>
                <div>
                  <CollectionSelector
                    setCollection={setCollection2}
                    setMemories={setMemories2}
                  />
                  {collection2 && collection2.collectionName}
                  {memories2.map((memory) => (
                    <div key={memory.id}>{memory.title}</div>
                  ))}
                </div>
              </div>
              {/* <DNDCollection collections={collections} memories={memories} /> */}
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
