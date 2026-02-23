"use client";

import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import homeImg from "@/../public/MockUp3.1.png";
import nurseImg from "@/../public/nurse.webp";
import { steps, benefits, features, testimonials } from "./data";
import { motion } from "framer-motion";

export default function SuppliersPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              <div className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  For Suppliers & Distributors
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Connect Directly with{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  Pharmacies
                </span>{" "}
                Across Ghana.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Showcase your inventory on our dedicated platform, gain valuable
                market insights, and streamline your distribution with real-time order management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="https://airtable.com/appR851wsboZLNR5T/pagoN7Sml1OQymwsc/form">
                  <Button className="w-auto px-6 py-5 sm:px-8 sm:py-6 bg-[#03C486] text-white rounded-full hover:bg-[#02b377] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                    Register Your Company
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-auto px-6 py-5 sm:px-8 sm:py-6 border-2 border-[#03C486] text-[#03C486] rounded-full hover:bg-[#03C486] hover:text-white font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
             
            </div>
            
            {/* Image */}
            <div className="relative">
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                <Image
                  src={homeImg}
                  alt="Healthcare Professionals Ready to Transform"
                  fill
                  className="rounded-2xl object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              How It Works for Suppliers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple steps to start selling to pharmacies across Ghana
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const stepImages = ['rename.jpg', 'hh.jpg', 'bb.jpg', 'ss.jpg', 'aa.jpg', 'pay.jpg'];
              return (
                <div
                  key={step.id}
                  className="text-center p-6 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative w-full h-48 mb-6 -mx-6 -mt-6">
                    <Image
                      src={`/steps/${stepImages[index]}`}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Benefits of Partnering with{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Kulobal Health
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Join our network of trusted suppliers and grow your business
              with advanced technology and market insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div 
                key={benefit.id} 
                className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 group hover:shadow-lg"
              >
                <div className="flex-shrink-0 flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-12 h-12 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Platform Features Section - Redesigned */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Advanced Technology</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Technology{" "}
              <span className="text-primary-600 dark:text-primary-400">Platform Features</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced tools designed to help suppliers succeed and grow their business on our platform
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="h-full bg-white dark:bg-neutral-800 rounded-2xl border-2 border-gray-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 p-8 transition-all duration-300 shadow-lg hover:shadow-2xl">
                    {/* Decorative Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-emerald-50/50 dark:from-primary-900/10 dark:to-emerald-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="flex justify-center items-center bg-gradient-to-br from-primary-600 to-emerald-600 dark:from-primary-500 dark:to-emerald-500 w-20 h-20 rounded-2xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-10 h-10 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ready to leverage these powerful features?
            </p>
            <Link href="https://airtable.com/appR851wsboZLNR5T/pagoN7Sml1OQymwsc/form">
              <Button className="px-8 py-6 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Register Your Company →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              What Suppliers Say About Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join successful suppliers who are growing their business with
              Kulobal Health
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-yellow-400">
                      ★
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </div>
                  <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 bg-primary-600">
        <div className="container py-16 mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our network of successful suppliers and start reaching more
            pharmacies today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Partner with Us to Grow Your Business
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="px-8 py-3 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Contact Partnership Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
