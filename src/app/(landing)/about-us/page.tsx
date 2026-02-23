"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Lightbulb, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import nurseImg from "@/../public/nurse.webp";
import patientSafetyImg from "@/../public/patientSafety.webp";
import { values, challenges, whyChooseUs } from "./data";

export default function AboutUsPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-primary-50 via-blue-50 to-white dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-900">
        <div className="container mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:max-w-xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 text-sm font-semibold text-primary-600 bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                  About Kulobal Health
                </span>
              </motion.div>
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Transforming Healthcare{" "}
                <span className="text-primary-600 dark:text-primary-400">Supply Chains</span> in Ghana
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                We&apos;re on a mission to revolutionize how medical supplies reach pharmacies, 
                ensuring every Ghanaian has access to quality healthcare products when they need them most.
              </p>
              <Link href="/contact">
                <Button size="lg" className="px-8 py-6 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl font-semibold text-base group">
                  Get in Touch
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] md:h-[450px] lg:h-[500px]"
            >
              <div className="relative w-full h-full overflow-hidden rounded-2xl">
                <Image
                  src={nurseImg}
                  alt="Healthcare Professional"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-500/20 dark:bg-primary-400/20"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-blue-500/20 dark:bg-blue-400/20 "></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-blue-600"></div>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  To democratize access to medical supplies across Ghana by creating a seamless, 
                  AI-powered marketplace that connects pharmacies with reliable suppliers, ensuring 
                  quality healthcare products reach every community within 48 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Vision
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  To become the leading healthcare supply chain platform in West Africa, empowering 
                  pharmacies and suppliers with innovative technology while ultimately improving health 
                  outcomes for millions of people.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-6 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              The Problem <span className="text-primary-600 dark:text-primary-400">We Solve</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Ghana&apos;s healthcare supply chain faces significant challenges that impact patient care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mr-4">
                    <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                      {challenge.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="p-8 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800">
              <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed font-medium">
                Kulobal Health addresses these challenges by creating a unified, technology-driven 
                platform that streamlines the entire supply chain from suppliers to pharmacies.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core <span className="text-primary-600 dark:text-primary-400">Values</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              The principles that guide everything we do at Kulobal Health
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all group border-2 hover:border-primary-300 dark:hover:border-primary-700">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-950/20">
        <div className="container mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:max-w-xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Meet Our <span className="text-primary-600 dark:text-primary-400">Expert Team</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Kulobal Health is powered by a diverse team of healthcare professionals, technology 
                experts, and business leaders who are passionate about improving healthcare accessibility 
                in Ghana.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Our combined expertise in healthcare, technology, logistics, and artificial 
                intelligence enables us to build solutions that truly understand and address the unique 
                challenges facing Ghana&apos;s healthcare supply chain.
              </p>
             
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/community2.webp"
                  alt="Kulobal Health Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-500/20 dark:bg-primary-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-primary-600 dark:text-primary-400">Kulobal Health?</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              We&apos;re more than just a marketplace - we&apos;re your partner in transforming healthcare supply chains
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {whyChooseUs.map((reason, index) => (
                <motion.div
                  key={reason.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all border-2 group hover:border-primary-200 dark:hover:border-primary-800">
                    <CardContent className="p-6 flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                          {reason.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-blue-100 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
              Join the healthcare revolution and be part of improving patient care across Ghana
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pharmacies">
                <Button size="lg" className="px-10 py-6 bg-white text-primary-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105">
                  For Pharmacies
                </Button>
              </Link>
              <Link href="/suppliers">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-6 border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-600 transition-all font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  For Suppliers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
