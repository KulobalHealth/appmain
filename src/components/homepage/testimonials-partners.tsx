import { Quote, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import groupImg from "@/../public/community2.webp";
import { testimonialPoints } from "./data";

export default function TestimonialsPartners() {
  return (
    <section className="px-4">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600">
              What Our Community Says
            </h2>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              Join thousands of pharmacies and suppliers who trust Kulobal
              Health for their supply chain needs
            </p>
            <div className="mb-6 flex gap-10 flex-col">
              {" "}
              <ul className="mt-4 space-y-4">
                {testimonialPoints.map((point) => (
                  <li key={point.id} className="flex items-start">
                    <div className="flex justify-center items-center bg-primary-600 w-5 h-5 rounded-full mr-3 flex-shrink-0 mt-1">
                      {point.type === "quote" ? (
                        <Quote className="w-3 h-3 text-white" />
                      ) : (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed dark:text-white">
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/about-us" className="w-fit">
                <Button className="w-fit hover:cursor-pointer py-6">
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
                {" "}
                <Image
                  src={groupImg}
                  alt="Happy Healthcare Professionals"
                  fill
                  objectFit="cover"
                  className="rounded-[7px]"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
