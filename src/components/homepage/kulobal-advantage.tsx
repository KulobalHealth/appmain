import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AiImg from "@/../public/pharmacist-working.webp";
import { advantages } from "./data";

export default function KulobalAdvantage() {
  return (
    <section className="px-4">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded-lg"
                style={{ width: "100%", height: "0", paddingBottom: "95.25%" }}
              >
                {" "}
                <Image
                  src={AiImg}
                  alt="AI-Powered Healthcare Technology"
                  fill
                  objectFit="cover"
                  className="rounded-[7px]"
                />
              </figure>
            </div>
          </div>
          <div className="lg:max-w-xl container mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
              <span className="text-sm font-medium text-gray-700">
                AI-Powered Platform
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-semibold text-primary-600">
              The Kulobal Health Advantage
            </h2>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              Harness the power of artificial intelligence to revolutionize your
              healthcare supply chain management
            </p>
            <div className="mb-6 flex gap-10 flex-col">
              <ul className="mt-4 space-y-3">
                {advantages.map((advantage) => (
                  <li key={advantage.id} className="flex items-start">
                    <div className="flex justify-center items-center bg-primary-600 w-5 h-5 rounded-full mr-3 flex-shrink-0 mt-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {advantage.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {advantage.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/about-us" className="w-fit">
                <Button className="w-fit hover:cursor-pointer py-6">
                  Learn More About Our AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
