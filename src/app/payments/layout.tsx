import type React from "react"

// Inter is loaded via globals.css to avoid Turbopack internal font import issues.
import Footer from "@/components/dashbord/footer"
import { SidebarProvider, SidebarInset} from "@/components/ui/sidebar"
import { DashboardNavbar } from "@/components/dashbord/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" w-full min-h-screen bg-white ">
      <DashboardNavbar />

      <SidebarProvider>
        <SidebarInset>
          <main className="flex min-h-screen b items-center justify-center">
           
            <div className=" h-full  flex p-4 md:py-24   w-[85%]">
              
         
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      <Footer />
    </div>
  )
}
