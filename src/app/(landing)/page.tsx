import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { ShinyButton } from "@/components/shiny-button";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";




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
                  className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
                >
                  Start For Free Today
                </ShinyButton>
              </div>
            </div>
        
        </MaxWidthWrapper>
      </section>
    </>
  );
}
