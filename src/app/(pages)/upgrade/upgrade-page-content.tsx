"use client"

// import { Card } from "@/components/ui/card"
// import { client } from "@/lib/client"
import { Plan } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
// import { format } from "date-fns"
// import { BarChart } from "lucide-react"
import { useRouter } from "next/navigation"

export const UpgradePageContent = ({ plan }: { plan: Plan }) => {
  const router = useRouter()

  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/create-checkout-session");
      return await res.json()
    },
    onSuccess: ({ url }) => {
      if (url) router.push(url)
    },
  })



  return (
    <div className="max-w-3xl flex flex-col">
      <div>
        <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900 mb-6">
          {plan === "PRO" ? "Plan: Pro" : "You are on the free plan"}
        </h1>
        <p className="text-sm/6 text-gray-600 max-w-prose">
          {plan === "PRO"
            ? "Thank you for supporting cronicle. "
            : "Get access to more storage and premium functions."}
        </p>
      </div>

        {plan !== "PRO" ? (
          <span
            onClick={() => createCheckoutSession()}
            className="inline cursor-pointer underline text-brand-600"
          >
            by upgrading to the Pro plan;
          </span>
        ) : null}
  
    </div>
  )
}
