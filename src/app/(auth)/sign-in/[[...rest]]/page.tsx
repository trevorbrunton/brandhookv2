"use client"

import { SignIn } from "@clerk/nextjs"


const Page = () => {


  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn
        forceRedirectUrl="/home"
      />
    </div>
  )
}

export default Page
