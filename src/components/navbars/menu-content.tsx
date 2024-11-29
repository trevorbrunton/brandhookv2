"use client";

import Link from "next/link";
import {
  Home,
  Gem,  

  Settings,
  LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";



  interface SidebarItem {
  href: string;
  icon: LucideIcon;
  text: string;
}

interface SidebarCategory {
  category: string;
  items: SidebarItem[];
}

const menuItems: SidebarCategory[] = [
  {
    category: "Overview",
    items: [{ href: "/home", icon: Home, text: "Home" }],
  },
  {
    category: "Account",
    items: [{ href: "/upgrade", icon: Gem, text: "Upgrade" }],
  },
  {
    category: "Settings",
    items: [

      {
        href: "/account-settings",
        icon: Settings,
        text: "Account Settings",
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};



export function MenuContent({onLinkClick}: {onLinkClick: () => void}) {
  return (
    <motion.nav
      className="flex flex-col items-start gap-4 px-2 py-5 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <UserButton
        showName
        appearance={{
          elements: {
            userButtonBox: "flex-row-reverse",
          },
        }}
      />

      {menuItems.map(({ category, items }) => (
        <motion.li key={category} variants={itemVariants} className="mb-4">
          <p className="text-xs font-medium leading-6 text-zinc-500">
            {category}
          </p>
          <div className="-mx-2 flex flex-1 flex-col">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-700 hover:bg-gray-50 transition"
                )}
                onClick={onLinkClick}
              >
                <item.icon className="size-4 text-zinc-500 group-hover:text-zinc-700" />
                {item.text}
              </Link>
            ))}
          </div>
        </motion.li>
      ))}
    </motion.nav>
  );
}
