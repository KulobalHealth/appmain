import reliableAccessImg from "@/../public/allKits.webp";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

const clinicFeatures = [
  "Streamline patient management and prescription workflows",
  "Real-time inventory tracking and automated reorder alerts",
  "AI-powered drug interaction checks for safer prescribing",
  "Digital prescription management and patient records",
];

export default function ClinicsPharmacies() {
  return (
    <section className="px-4">
      <div className="container py-5 mx-auto md:py-1">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded"
                style={{ width: "100%", height: "0", paddingBottom: "95.25%" }}
              >
                <Image
                  src={reliableAccessImg}
                  alt="Clinics and Pharmacies"
                  fill
                  objectFit="cover"
                  className="rounded"
                />
              </figure>
            </div>
          </div>{" "}
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600">
              For Clinics & Pharmacies
            </h2>
            <div className="mb-6 flex gap-4 flex-col">
              <ul className="mt-4 space-y-3">
                {clinicFeatures.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <div className="flex justify-center items-center bg-primary-600 w-5 h-5 rounded-full mr-2">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-fit ">
                <Button className="w-fit hover:cursor-pointer">
                  Start Managing Your Clinic
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
