"use client";
import { useState } from "react";
import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";

import { NavSideBar } from "@/components/navbars/nav-side-bar";

import { PageFrame } from "@/components/pageframe";
import { CollectionSelector } from "@/components/collection-selector";
import { Collection, Memory } from "@prisma/client";

import { MemoryDnd } from "@/components/memory-dnd";

export default function Home() {
  const navItems = null;
  const [collection1, setCollection1] = useState<Collection | null>(null);
  const [collection2, setCollection2] = useState<Collection | null>(null);
  const [memories1, setMemories1] = useState<Memory[]>([]);
  const [memories2, setMemories2] = useState<Memory[]>([]);

  const collections = [collection1, collection2];
  const memories = [memories1, memories2];

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="memory-sorter" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="memory-sorter" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Memory Sorter" />
            <MainContentRow>
              <div className="grid grid-cols-2 gap-16 py-4 mx-40">
                <CollectionSelector
                  setCollection={setCollection1}
                  setMemories={setMemories1}
                />

                <CollectionSelector
                  setCollection={setCollection2}
                  setMemories={setMemories2}
                />
              </div>
              <MemoryDnd
                collections={collections.filter((c) => c !== null)}
                memories={memories}
              />
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
