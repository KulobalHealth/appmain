import type { Metadata } from "next";
import localfont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "react-hot-toast"
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { CookieBanner } from "@/components/cookie-banner";

// Inter is loaded via CSS in globals.css to avoid Turbopack internal font import issues.

const euclidCircularB = localfont({
  src: [
    {
      path: "../fonts/EuclidCircularB-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/EuclidCircularB-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/EuclidCircularB-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-euclid-circular-b",
  display: "swap",
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "KulobalHealth · Pharmaceuticals At Your Fingertips",
  description:
    "KulobalHealth, Pharmaceuticals At Your Fingertips buy medicine online, mobile app, medicine delivery, oda",
  keywords:
    "buy order delivery online medicines,dawa nunua bei kuagiza kuletewa oda KulobalHealth Pharmaceuticals madawa",
  authors: [{ name: "churchycodes" }],
  icons: {
    icon: "https://res.cloudinary.com/ddwet1dzj/image/upload/v1766605929/favicon_fppsni.jpg",
    shortcut: "https://res.cloudinary.com/ddwet1dzj/image/upload/v1766605929/favicon_fppsni.jpg",
    apple: "https://res.cloudinary.com/ddwet1dzj/image/upload/v1766605929/favicon_fppsni.jpg",
  },
  openGraph: {
    title: "KulobalHealth · Pharmaceuticals At Your Fingertips",
    siteName: "www.kulobalhealth.co.tz",
    description:
      "KulobalHealth (KH) is a registered company that mainly focuses on innovations to improve pharmaceutical supply chain. The app is run by KH Pharmacy located at Kariakoo in Dar es Salaam. The app currently serves for wholesale business only to pharmacies, ADDOs, and health facilities such as Hospitals and Clinics.",
  },
  alternates: {
    // android: "https://play.google.com/store/apps/details?id=com.kulobalhealth.buyers",
    // ios: "https://apps.apple.com/tz/app/kulobalhealth/id1625919956",
  },
  other: {
    "al:android:app_name": "kulobalhealth",
    "al:ios:app_name": "kulobalhealth",
    "al:ios:app_store_id": "id1625919956",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                try {
                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark')
                    } else {
                    document.documentElement.classList.remove('dark')
                  }
                } catch (_) {}
                `,
          }}
        />
      </head>
      <body className={`${euclidCircularB.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar/>
            {children}
            <CookieBanner />
          </AuthProvider>
           <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10b981",
                color: "#fff",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#ef4444",
                color: "#fff",
              },
            },
          }}
        />
        </ThemeProvider>
      </body>
    </html>
  );
}
