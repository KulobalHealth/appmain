import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { contactMethods, inquiryTypes, contactInfo, faqSections } from "./data";

export default function ContactPage() {
  return (
    <div>
      {" "}
      <section className="px-4 min-h-screen rounded-md flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Icons.Banner className="w-full h-full opacity-20 object-cover" />
        </div>
        <div className="container py-20 mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-4 text-5xl font-bold text-primary-600 dark:text-primary-400">
              Get in Touch with Us
            </h1>
            <p className="text-gray-600 dark:text-white mb-8 text-lg">
              Have questions about our platform? Want to become a partner?
              We&apos;re here to help you transform your healthcare supply
              chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contact-form">
                <Button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Send us a Message
                </Button>
              </Link>
              <Link href="#faq">
                <Button
                  variant="outline"
                  className="px-8 py-3 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  View FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>{" "}
      <section className="px-4 bg-white dark:bg-background">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              How to Reach Us
            </h2>
            <p className="text-gray-600 dark:text-white max-w-2xl mx-auto">
              Choose the method that works best for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contactMethods.map((method) => (
              <div
                key={method.id}
                className="text-center p-6 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
              >
                <div className="flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-16 h-16 rounded-lg mx-auto mb-4">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 dark:text-white text-sm mb-4">
                  {method.description}
                </p>
                <div className="space-y-1">
                  {method.details.map((detail, idx) => (
                    <div
                      key={`${method.id}-detail-${idx}`}
                      className="text-primary-600 dark:text-primary-400 font-medium text-sm"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>{" "}
      <section id="contact-form" className="px-4 bg-gray-50 dark:bg-background">
        <div className="container py-16 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-white mb-8">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible. Whether you&apos;re a pharmacy looking to
                streamline your procurement or a supplier wanting to expand your
                reach, we&apos;re here to help.
              </p>

              <div className="space-y-6">
                {contactInfo.items.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 dark:text-white text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-background p-8 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Your first name"
                      className="w-full dark:bg-neutral-900 dark:border-neutral-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Your last name"
                      className="w-full dark:bg-neutral-900 dark:border-neutral-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full dark:bg-neutral-900 dark:border-neutral-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    className="w-full dark:bg-neutral-900 dark:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Company/Organization
                  </label>
                  <Input
                    type="text"
                    placeholder="Your company name"
                    className="w-full dark:bg-neutral-900 dark:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Select inquiry type</option>
                    {inquiryTypes.map((type) => (
                      <option key={type.id} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Message *
                  </label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="w-full dark:bg-neutral-900 dark:border-neutral-600"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Send Message
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By submitting this form, you agree to our Privacy Policy and
                  Terms of Service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>{" "}
      <section id="faq" className="px-4 bg-white dark:bg-background">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-white max-w-2xl mx-auto">
              Find quick answers to common questions about Kulobal Health
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {faqSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    {section.title}
                  </h3>
                  <div className="space-y-4">
                    {section.faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
                      >
                        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 dark:text-white text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-white mb-4">
                Don&apos;t see your question here?
              </p>
              <Link href="#contact-form">
                <Button
                  variant="outline"
                  className="px-8 py-3 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Ask Us Directly
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 bg-gray-50 dark:bg-background">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Our Location
            </h2>
            <p className="text-gray-600 dark:text-white">
              Visit us at Wangara Green Ventures in Accra, Ghana
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Wangara Green Ventures
                </h3>
                <div className="flex items-center text-gray-600 dark:text-white mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Accra, Ghana</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-white mb-4">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+233 25 678 0758</span>
                </div>
              </div>

              <div className="bg-gray-200 dark:bg-neutral-800 h-64 rounded-lg overflow-hidden">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.6946925847515!2d-0.15756278546422656!3d5.635001994336073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b0074a0f5b1%3A0x26dc1c7e5a6684a5!2sWangara%20Green%20Ventures!5e0!3m2!1sen!2sgh!4v1733661600000!5m2!1sen!2sgh"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>

              <div className="mt-4 text-center">
                <a
                  href="https://www.google.com/maps/place/Wangara+Green+Ventures/@5.6350019,-0.1575628,17z/data=!3m1!4b1!4m6!3m5!1s0xfdf9b0074a0f5b1:0x26dc1c7e5a6684a5!8m2!3d5.6350019!4d-0.1575628!16s%2Fg%2F11fqptfxfx?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
