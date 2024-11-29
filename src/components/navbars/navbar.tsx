"use client";
import Link from "next/link";
import { MaxWidthWrapper } from "../max-width-wrapper";
import { SignOutButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
// import { currentUser } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";



export const Navbar = () => {
  const {userId} = useAuth();

  return (
    <MaxWidthWrapper>
      <nav
        className="sticky z-[100] h-16 inset-x-0 top-0 border-b border-gray-200 bg-muted/40 backdrop-blur-lg transition-all px-4
    mb-2 mx-2"
      >
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <span className="text-brand-700 tracking-widest font-bold text-2xl">
              cronicle
            </span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {userId ? (
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton>
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
                    className: "flex items-center gap-1.5",
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
