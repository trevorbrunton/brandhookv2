"use client";
import Link from "next/link";
import { MaxWidthWrapper } from "../max-width-wrapper";
// import { SignOutButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { UserButton, SignOutButton } from "@clerk/nextjs";

export interface NavItem {
  label: string;
  href: string;
  tooltip: string;
}

interface NavbarProps {
  navItems: NavItem[] | null;
}

export const Navbar = ({ navItems }: NavbarProps) => {
  const { userId } = useAuth();
  const router = useRouter();

  return (
    <MaxWidthWrapper>
      <nav
        className="sticky h-16 inset-x-0 top-0 border-b border-gray-200 backdrop-blur-lg transition-all px-4
    mb-2 mx-2"
      >
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <img
              src="/brandhook.png"
              alt="Brandhook"
              className="h-12 w-auto"/>
          </Link>
          <div className="h-full flex items-center space-x-4">
            <TooltipProvider>
              {navItems &&
                navItems.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs z-999"
                        onClick={() => {
                          router.push(item.href);
                          router.refresh();
                        }}
                      >
                        {item.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={16}>
                      {item.tooltip}{" "}
                    </TooltipContent>
                  </Tooltip>
                ))}
            </TooltipProvider>

            {userId ? (
              <>
                 <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton> 
                <UserButton
                 
                  showName={false}
                  appearance={{
                    
                    elements: {
                      userButtonBox: "flex-row-reverse",
                    },
                  }}
                />
              </>
            ) : (
              <>
                {/* <Link
                  href="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                </Link> */}
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign in
                </Link>

                <div className="h-8 w-px bg-gray-200" />

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1.5 bg-brand-25 text-white",
                  })}
                >
                  Sign up <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </MaxWidthWrapper>
  );
};
