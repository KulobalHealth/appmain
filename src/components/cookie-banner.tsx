"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Cookie } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6 md:p-8">
              {/* Close button */}
              <button
                onClick={declineCookies}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close banner"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 md:w-8 md:h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                    <Link 
                      href="/privacy-policy" 
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    {" "}and{" "}
                    <Link 
                      href="/terms-of-service" 
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>
                    {" "}to learn more.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    onClick={declineCookies}
                    variant="outline"
                    className="w-full sm:w-auto px-6 py-5 md:py-6 border-2 text-sm md:text-base font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={acceptCookies}
                    className="w-full sm:w-auto px-6 py-5 md:py-6 bg-primary-600 hover:bg-primary-700 text-white text-sm md:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
