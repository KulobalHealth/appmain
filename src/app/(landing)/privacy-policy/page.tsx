"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText, Users, Globe, Mail, Calendar } from "lucide-react"

export default function PrivacyPolicyPage() {
  const lastUpdated = "February 8, 2026"

  const sections = [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: FileText,
      content: [
        {
          subtitle: "Personal Information",
          text: "When you register for an account or use our services, we may collect personal information such as your name, email address, phone number, business name, pharmacy license number, and billing information."
        },
        {
          subtitle: "Health-Related Data",
          text: "As a healthcare platform, we may process health-related data including patient information (with proper consent), prescription details, and medication records. This data is handled with the highest level of security and in compliance with applicable healthcare regulations."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you interact with our platform, including IP addresses, browser type, pages visited, time spent on pages, and other diagnostic data."
        },
        {
          subtitle: "Transaction Data",
          text: "We collect information related to your purchases, orders, and transactions on our platform, including payment details (processed securely through our payment partners)."
        }
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        {
          subtitle: "Service Delivery",
          text: "To provide, maintain, and improve our pharmacy marketplace services, process transactions, and deliver products you order."
        },
        {
          subtitle: "Communication",
          text: "To send you important updates about your orders, account notifications, and service-related announcements. With your consent, we may also send promotional communications."
        },
        {
          subtitle: "Security & Fraud Prevention",
          text: "To protect our platform, users, and partners from fraudulent activities, unauthorized access, and other security threats."
        },
        {
          subtitle: "Analytics & Improvement",
          text: "To analyze usage patterns and improve our platform's functionality, user experience, and service offerings."
        },
        {
          subtitle: "Legal Compliance",
          text: "To comply with applicable laws, regulations, and legal processes, including healthcare industry requirements."
        }
      ]
    },
    {
      id: "data-sharing",
      title: "Information Sharing & Disclosure",
      icon: Users,
      content: [
        {
          subtitle: "Service Providers",
          text: "We share information with trusted third-party service providers who assist us in operating our platform, processing payments, delivering products, and providing customer support."
        },
        {
          subtitle: "Business Partners",
          text: "We may share relevant information with pharmaceutical suppliers and logistics partners to fulfill your orders and provide our services."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information when required by law, court order, or government regulation, or when necessary to protect our rights, privacy, safety, or property."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption protocols (SSL/TLS) to protect data transmitted between your device and our servers."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls and authentication measures to ensure only authorized personnel can access sensitive data."
        },
        {
          subtitle: "Regular Audits",
          text: "We conduct regular security audits and assessments to identify and address potential vulnerabilities."
        },
        {
          subtitle: "Data Minimization",
          text: "We only collect and retain data that is necessary for providing our services and fulfilling legal obligations."
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights & Choices",
      icon: Shield,
      content: [
        {
          subtitle: "Access & Correction",
          text: "You have the right to access your personal information and request corrections to any inaccurate data we hold about you."
        },
        {
          subtitle: "Data Deletion",
          text: "You may request deletion of your personal data, subject to certain legal and operational requirements."
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt out of receiving promotional communications at any time by clicking the unsubscribe link in our emails or updating your account preferences."
        },
        {
          subtitle: "Data Portability",
          text: "You have the right to request a copy of your data in a structured, commonly used format."
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies & Tracking Technologies",
      icon: Globe,
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use essential cookies that are necessary for the platform to function properly, including session management and security features."
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand how visitors interact with our platform, helping us improve our services."
        },
        {
          subtitle: "Preference Cookies",
          text: "These cookies remember your preferences and settings to provide a more personalized experience."
        },
        {
          subtitle: "Managing Cookies",
          text: "You can manage your cookie preferences through your browser settings. Note that disabling certain cookies may affect platform functionality."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-emerald-700" />
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Kulobal Health collects, uses, and protects your personal information.
            </p>
            <div className="flex items-center justify-center gap-2 mt-8 text-white/70">
              <Calendar className="w-5 h-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  Welcome to Kulobal Health. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our pharmacy marketplace platform and related services.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>
            </motion.div>

            {/* Policy Sections */}
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-12 scroll-mt-32"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pt-2">
                    {section.title}
                  </h2>
                </div>
                
                <div className="space-y-6 pl-0 md:pl-16">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Data Retention */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pt-2">
                  Data Retention
                </h2>
              </div>
              <div className="pl-0 md:pl-16">
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-600 leading-relaxed">
                    We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it. For healthcare-related data, we follow applicable regulations regarding retention periods.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Children's Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pt-2">
                  Children&apos;s Privacy
                </h2>
              </div>
              <div className="pl-0 md:pl-16">
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal data from a child without parental consent, we will take steps to delete that information promptly.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Policy Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pt-2">
                  Changes to This Policy
                </h2>
              </div>
              <div className="pl-0 md:pl-16">
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-600 leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl p-8 md:p-12"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Contact Us
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Have questions about this Privacy Policy?
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <a href="mailto:privacy@kulobalhealth.com" className="text-primary-600 hover:underline">
                      privacy@kulobalhealth.com
                    </a>
                  </div>
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">
                      Kulobal Health<br />
                      Accra, Ghana
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
