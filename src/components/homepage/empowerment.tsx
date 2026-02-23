import nurseImg from "@/../public/nurse.webp";
import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const features = [
  "Reliable Access to Rapid Test Kits",
  "Scalable and Sustainable Healthcare Solution",
  "AI-Powered Inventory & Test Management",
];

export default function Empowerment() {
  return (
    <section className="px-4">
      <div className="container py-5 mx-auto md:py-1">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded"
                style={{ width: "100%", height: "0", paddingBottom: "90.25%" }}
              >
                <Image
                  src={nurseImg}
                  alt="Empowering Healthcare Providers"
                  fill
                  objectFit="contain"
                  className="rounded"
                />
              </figure>
            </div>
          </div>
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600">
              Health Technology Offering
            </h2>
            <div className="mb-6 flex flex-col gap-5">
              <span>
                <p className="mb-0">
                  Kulobal Health provides a digital health platform designed to
                  improve access to rapid diagnostic test (RDT) kits, optimize
                  pharmacy operations, and enhance patient care.
                </p>
                <ul className="mt-4 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <div className="flex justify-center items-center bg-primary-600 w-5 h-5 rounded-full mr-2">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </span>

              <Link href="/login" className="w-fit">
                <Button className="w-fit hover:cursor-pointer">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
