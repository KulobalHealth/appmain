"use client";

import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import { Button } from "./ui/button";

const usefulLinks = [
  { href: "/privacy-policy", text: "Privacy Policy" },
  { href: "/terms-of-service", text: "Terms of Service" },
  { href: "/cookies-settings", text: "Cookies Settings" },
];

const productsAndServices = [
  { href: "/", text: "Kulobal.com" },
  { href: "/marketplace", text: "Marketplace" },
  { href: "/detection", text: "Detection" },
];

const helpLinks = [
  { href: "/contact", text: "Help Center" },
  { href: "/contact", text: "FAQs" },
  { href: "/suppliers", text: "POS Service" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900 py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="flex flex-col gap-3.5 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              <Image
                src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1766605935/logo_xkdsfz.webp"
                alt="KulobalHealth"
                width={180}
                height={50}
                className="transition-transform duration-300 hover:brightness-110"
                priority
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Enhance your pharmacy services and improve customer satisfaction
              with these innovative tools available on Kulobal Health.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Useful links</h3>
            <ul className="space-y-3">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Products & Services</h3>
            <ul className="space-y-3">
              {productsAndServices.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Help</h3>
            <ul className="space-y-3">
              {helpLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">Subscribe to our newsletter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Join our newsletter to stay up to date on features and releases.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              />
              <Button 
                type="submit"
                className="w-full sm:w-[178px] rounded-xl h-12 font-semibold text-white bg-primary-500 hover:bg-primary-600"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} KulobalHealth. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Visit our Facebook page"
            >
              <Facebook size={20} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Visit our Instagram page"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Visit our Twitter page"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/kulobalhealth/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Visit our LinkedIn page"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
