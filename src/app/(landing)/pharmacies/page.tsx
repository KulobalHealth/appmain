"use client";

import { Button } from "@/components/ui/button";
import { Check, Star, Pill, Stethoscope, Syringe, Heart, Thermometer, Shield, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import allKitsImg from "@/../public/MockUp4.1.png";
import pharmaImg from "@/../public/allKits.webp";
import { steps, benefits, categories, testimonials } from "./data";
import { Icons } from "@/components/ui/icons";
import { motion } from "framer-motion";

export default function PharmaciesPage() {
  return (
    <div>
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <Icons.Banner className="w-full h-full object-cover" />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 dark:bg-primary-600/20 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-600/20 rounded-full blur-xl"
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-24 h-24 bg-primary-300/30 dark:bg-primary-500/20 rounded-full blur-xl"
          animate={{
            y: [0, 25, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20 gap-12 lg:gap-16">
            {/* Left Content */}
            <motion.div
              className="flex-1 max-w-2xl text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="w-4 h-4" />
                <span>Trusted by 500+ Pharmacies</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Source All Your{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  Medical Supplies
                </span>
                , Effortlessly
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Access a vast online marketplace with competitive pricing,
                diverse brands, and guaranteed 48-hour delivery. Transform your
                procurement today.
              </p>

              {/* Stats */}
              

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/marketplace">
                  <Button className="px-8 py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Browse Products →
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="px-8 py-6 border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-base font-semibold"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="flex-1 relative w-full px-8 sm:px-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Decorative Circle */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-400 to-emerald-400 dark:from-primary-600 dark:to-emerald-600 rounded-full blur-3xl opacity-20"></div>
                
                {/* Main Image Container */}
                <div className="relative">
                  <Image
                    src={pharmaImg}
                    alt="Pharmacy Supplies"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating Cards */}
                  <motion.div
                    className="absolute top-6 -left-6 sm:-left-12 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-5 w-[180px] sm:w-[220px] border border-gray-100 dark:border-neutral-700"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl flex-shrink-0">
                        <Pill className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Products Available
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          10,000+
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-6 -right-6 sm:-right-12 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-5 w-[180px] sm:w-[220px] border border-gray-100 dark:border-neutral-700"
                    animate={{
                      y: [0, 10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl flex-shrink-0">
                        <Heart className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Fast Delivery
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          48 Hours
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Redesigned */}
      <section className="px-4 py-20 bg-gradient-to-br from-emerald-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 dark:bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200/20 dark:bg-primary-600/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Stethoscope className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works for{" "}
              <span className="text-primary-600 dark:text-primary-400">Pharmacies</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple steps to get all your medical supplies delivered to your pharmacy with ease and efficiency
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative"
              >
                <div className="h-full bg-white dark:bg-neutral-800 rounded-2xl border-2 border-gray-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 p-8 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  {/* Decorative Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-emerald-50/50 dark:from-primary-900/10 dark:to-emerald-900/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    {/* Step Number Badge */}
                    <div className="flex justify-center items-center bg-gradient-to-br from-primary-600 to-emerald-600 dark:from-primary-500 dark:to-emerald-500 w-16 h-16 rounded-2xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-2xl">
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {step.description}
                    </p>

                    {/* Arrow Connector (except last item) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 -right-8 text-primary-300 dark:text-primary-700">
                        <svg className="w-16 h-8" fill="none" stroke="currentColor" viewBox="0 0 64 32">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M0 16h56M40 4l16 12-16 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
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
              Ready to streamline your pharmacy procurement?
            </p>
            <Link href="/signup">
              <Button className="px-8 py-6 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Get Started Today →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Section - Redesigned */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="container mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Side - Image */}
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-300/30 to-emerald-300/30 dark:from-primary-600/20 dark:to-emerald-600/20 rounded-3xl blur-2xl"></div>
                
                <div className="relative rounded-3xl overflow-hidden">
                  <Image
                    src={allKitsImg}
                    alt="Medical Supplies Benefits"
                    width={600}
                    height={700}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Floating Badge */}
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-neutral-700"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                      99.5%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Customer Satisfaction
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Why Choose Us</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Benefits for Your{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  Pharmacy
                </span>
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Transform your procurement process with our comprehensive
                platform designed specifically for pharmacies. Experience seamless ordering and reliable service.
              </p>

              {/* Benefits Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.slice(0, 4).map((benefit) => (
                  <motion.div
                    key={benefit.id}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex-shrink-0 flex justify-center items-center bg-primary-100 dark:bg-primary-900/30 w-10 h-10 rounded-full">
                      <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/marketplace">
                  <Button className="px-8 py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Explore Products →
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="px-8 py-6 border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-base font-semibold"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Product Categories Section - Redesigned */}
      <section className="px-4 py-20 bg-white dark:bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
        
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
              <Package className="w-4 h-4" />
              <span>Our Categories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Product{" "}
              <span className="text-primary-600 dark:text-primary-400">Categories</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our comprehensive range of medical products and supplies, carefully curated for your pharmacy needs
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href="/marketplace" className="block h-full group">
                  <div className="relative h-full bg-gradient-to-br from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    {/* Icon/Number Badge */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    
                    {/* Category Icon Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Package className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {category.description}
                    </p>

                    {/* Arrow Icon */}
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Explore</span>
                      <svg 
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/marketplace">
                <Button className="px-10 py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Browse All Products →
                </Button>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Over <span className="font-bold text-primary-600 dark:text-primary-400">10,000+</span> products available
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="px-4">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              What Pharmacies Say About Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join hundreds of pharmacies who trust Kulobal Health for their
              supply needs
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
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
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
      {/* CTA Section */}
      <section className="px-4 bg-primary-600">
        <div className="container py-16 mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Simplify Your Procurement?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of pharmacies already using Kulobal Health to
            streamline their supply chain
          </p>
          <Link href="/signup">
            <Button className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              Sign Up Today and Simplify Your Procurement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
