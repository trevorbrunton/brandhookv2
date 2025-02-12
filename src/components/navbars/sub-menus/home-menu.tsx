"use client";
import Link from "next/link";
import { Gem } from "lucide-react";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/lib/utils";

import { NewProjectDialog } from "../../dialogs/new-project-details-dialog";
import { SettingsDialog } from "../../dialogs/settings-dialog";

interface MenuProps {
    userId: string;
    onLinkClick: () => void;
}

export function HomeMenu({ userId, onLinkClick }: MenuProps) {
  return (
    <>
      <p className="text-xs font-medium leading-6 text-zinc-500">Actions</p>
      <div className="mx-1 flex items-center">
        <NewProjectDialog />
      </div>

      <p className="text-xs font-medium leading-6 text-zinc-500 mt-8">
        Settings
      </p>
      <div className="flex flex-1 flex-col">
        <div className="py-1.5 flex items-center">
          <SettingsDialog userId={userId} />
        </div>
        <Link
          href={"/upgrade"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition mx-2"
          )}
          onClick={onLinkClick}
        >
          <Gem className="size-4 text-zinc-500 group-hover:text-zinc-700" />
          Upgrade
        </Link>
      </div>
    </>
  );
}
