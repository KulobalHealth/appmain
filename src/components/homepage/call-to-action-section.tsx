import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallToActionSection() {
  return (
    <section className="px-4 py-20 bg-gradient-to-br from-[#03C486] to-[#02b377]">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your Healthcare Supply Chain?
          </h2>
          <p className="text-lg sm:text-xl text-green-50 max-w-3xl mx-auto leading-relaxed">
            Join thousands of pharmacies and suppliers revolutionizing their business with Kulobal Health
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/marketplace" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 py-6 bg-white text-[#03C486] hover:bg-gray-50 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all group">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-[#03C486] rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
