"use client"

import { useState } from "react"
import { Menu, Building2, Truck, Shield, Users, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const solutions = [
  {
    name: "For Pharmacies",
    href: "/pharmacies",
    description: "Source medical supplies effortlessly with competitive pricing and 48-hour delivery.",
    icon: Building2,
  },
  {
    name: "For Suppliers",
    href: "/suppliers",
    description: "Expand your reach and connect with pharmacies across Ghana.",
    icon: Truck,
  },
  {
    name: "Detection",
    href: "/detection",
    description: "AI-powered counterfeit detection for medical supplies and pharmaceuticals.",
    icon: Shield,
  },
]

const navigationLinks = [
  { name: "About Us", href: "/about-us", icon: Users },
  { name: "Contact Us", href: "/contact", icon: Phone },
]

export default function SimpleDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Simple Navigation Drawer</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Clean and simple drawer component with always-visible solutions
          </p>
        </div>

        {/* Trigger Button - Icon Only with Animation */}
        <div className="flex justify-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300 w-12 h-12 rounded-full"
              >
                <Menu
                  className={`h-6 w-6 transition-transform duration-300 ${
                    isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
                  }`}
                />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/20 dark:border-gray-700/30"
            >
              <SheetHeader className="pb-6">
                <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white">Navigation</SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                {/* Solutions Section - Always Open */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">Solutions</h3>
                  </div>

                  <div className="space-y-2">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors duration-200 group"
                      >
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-950/70 transition-colors">
                          <item.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Navigation Links */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">More</h3>
                  </div>

                  <div className="space-y-2">
                    {navigationLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors duration-200 group"
                      >
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-950/70 transition-colors">
                          <item.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">© 2024 KulobalHealth</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
