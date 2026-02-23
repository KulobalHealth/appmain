import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const monthlyPrice = 150;
  const yearlyPrice = monthlyPrice * 12;
  const yearlyDiscount = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  const features = [
    "Complete Dashboard Access",
    "Order Tracking & Management",
    "Patient Records Management",
    "24/7 Priority Support",
    "Regular Updates & New Features",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                Simple & Transparent Pricing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Everything You Need to{" "} <br></br>
                <span className="text-primary-600 dark:text-primary-400">
                    Manage Your Pharmacy
                </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              One comprehensive package with all the features you need to streamline your pharmacy operations
              and improve patient care.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-xl mx-auto">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-primary-600 dark:border-primary-500 overflow-visible">
              {/* Popular Badge */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              </div>

              <div className="p-5 md:p-6 pt-10 md:pt-12">
                {/* Package Name */}
                <div className="text-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Professional Plan
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Complete pharmacy management solution
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">GH₵</span>
                    <span className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {monthlyPrice}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">/month</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px bg-gray-300 dark:bg-gray-600 w-12"></div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">or</span>
                    <div className="h-px bg-gray-300 dark:bg-gray-600 w-12"></div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-base font-semibold text-gray-900 dark:text-white">GH₵</span>
                      <span className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {yearlyPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">/year</span>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                      Save 2 months when you pay yearly
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2.5 mb-4 items-center">
                  <Link href="/signup" className="w-auto">
                    <Button className="px-6 py-3 bg-[#03C486] hover:bg-[#02b377] text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                      Get Started Now
                    </Button>
                  </Link>
                  <Link href="/contact" className="w-auto">
                    <Button
                      variant="outline"
                      className="px-6 py-3 border-2 border-[#03C486] text-[#03C486] rounded-full hover:bg-[#03C486] hover:text-white font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                </div>

                {/* Features List */}
                <div className="space-y-2 flex flex-col items-center">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 text-center">
                    Everything Included:
                  </h3>
                  <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 w-full max-w-md mx-auto">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex-shrink-0 flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-4 h-4 rounded-full mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Badge */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-1.5 rounded-full">
                      <svg
                        className="w-4 h-4 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">24/7 Priority Support</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Get help anytime you need</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
              Need a custom solution for multiple locations or enterprise needs?
            </p>
            <Link href="/contact">
              <Button variant="link" className="text-primary-600 dark:text-primary-400 font-semibold text-base">
                Contact us for custom pricing →
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">500+</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Active Pharmacies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">99.9%</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">24/7</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">Secure</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">Data Storage</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
