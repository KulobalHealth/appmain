import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
// Inter is loaded via globals.css to avoid Turbopack internal font import issues.
import Footer from "@/components/dashbord/footer"
import { DashboardNavbar } from "@/components/dashbord/navbar"
import { FloatingBottomNavbar } from "@/components/floating-navbar"
import AuthGuard from "@/components/auth-guard"
import SubscriptionGuard from "@/components/subscription-guard"

// If Inter is available via CSS, the body or container will pick it up. Fallbacks in CSS will apply.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SubscriptionGuard>
        <div className="w-full min-h-screen bg-[#0f0f1a]">
          {/* Fixed Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <AppSidebar />
          </div>

          {/* Fixed Header */}
          <DashboardNavbar />

          {/* Main Content Area */}
          <div className="md:ml-[240px] min-h-screen flex flex-col pt-14">
            <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-56px)]">
              {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <FloatingBottomNavbar />
            
            <Footer />
          </div>
        </div>
      </SubscriptionGuard>
    </AuthGuard>
  )
}
