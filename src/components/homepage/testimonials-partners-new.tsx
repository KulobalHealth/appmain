import { Quote, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const testimonialPoints = [
  '"Kulobal Health has transformed how we manage our inventory. The AI recommendations have helped us reduce stockouts by 80%." - Dr. Sarah Mensah, HealthCare Plus Pharmacy',
  '"As a supplier, this platform has expanded our reach significantly. We have connected with over 200 new pharmacies in just 6 months." - Michael Osei, MedSupply Ghana',
  '"The 48-hour delivery promise is real! Our customers are happier, and we can focus more on patient care." - Agnes Boateng, Community Health Pharmacy',
  "Trusted by 500+ pharmacies and 100+ suppliers across Ghana and West Africa",
  "99% customer satisfaction rate with our AI-powered platform and logistics",
];

export default function TestimonialsPartners() {
  return (
    <section className="px-4 bg-white">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600">
              What Our Community Says
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of pharmacies and suppliers who trust Kulobal
              Health for their supply chain needs
            </p>
            <div className="mb-6 flex gap-4 flex-col">
              <ul className="mt-4 space-y-4">
                {testimonialPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex justify-center items-center bg-primary-600 w-5 h-5 rounded-full mr-3 flex-shrink-0 mt-1">
                      {index < 3 ? (
                        <Quote className="w-3 h-3 text-white" />
                      ) : (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/about-us" className="w-fit">
                <Button className="w-fit hover:cursor-pointer">
                  Read More Testimonials
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded-lg"
                style={{ width: "100%", height: "0", paddingBottom: "95.25%" }}
              >
                <Image
                  src="/images/groupImg.png"
                  alt="Happy Healthcare Professionals"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
