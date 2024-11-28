import { ReactNode } from "react"
import { Navbar } from "@/components/navbars/navbar"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout
