import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const heroButtons = [
  {
    text: "Start for free",
    variant: "default" as const,
  },
  {
    text: "Read the docs",
    variant: "secondary" as const,
  },
  {
    text: "Book a demo",
    variant: "outline" as const,
  },
];

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-[#02A171] to-[#7E22CE] text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <Badge
          variant="secondary"
          className="mb-6 bg-white/20 text-white rounded-full border-white/30"
        >
          Real-time drug-interaction intelligence
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Real-time drug-interaction
          <br />
          intelligence for <span className="text-green-300">every</span>
          <br />
          <span className="text-green-300">prescription</span>
        </h1>

        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Drop evidence-based safety checks straight into the software and
          mobile apps that pharmacists, prescribers, and tele-health platforms
          already use.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {heroButtons.map((button, index) => (
            <Button key={index} size="lg" variant={button.variant}>
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
