import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { ShinyButton } from "@/components/shiny-button";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";




export default async function LandingPage() {
  const auth = await currentUser();
  if (auth) {
    redirect("/home");
  }

  return (
    <>
      {/* Hero section */}
      <section className="relative sm:py-24 py-6">
        <MaxWidthWrapper className="text-center bg-white">
          <div className="flex flex-col items-center h-full space-y-16 ">
            <div className="flex items-center space-x-4 w-96">
              <Image
                src={"/ladyVC.jpg"}
                alt="logo"
                width={150}
                height={150}
                className="rounded-full"
              />
              <Image
                src="/brandhook.png"
                alt="Brandhook"
                width={200}
                height={100}
              />
            </div>

            <span className=" text-wrap font-light text-center text-xl tracking-wide text-normal">
              Take your brand further.
            </span>

            <div className="w-full max-w-80">
              <ShinyButton
                href="/sign-up"
                className="relative z-10 h-14 w-full text-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                Start For Free Today
              </ShinyButton>
            </div>

            <div
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-30 justify-center flex items-center gap-x-2.5 rounded-md p-8 text-base font-medium leading-6 text-white hover:bg-gray-50 transition mx-2 mt-20 bg-brown"
              )}
            >
              <Link href="https://cronicle-file-uploads.s3.ap-southeast-2.amazonaws.com/BrandHook+Discover+AI+App+How+to+Use.mov">
                <p className="">Watch the Brandhook Discover AI</p>
                <p>Tool Explainer</p>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
