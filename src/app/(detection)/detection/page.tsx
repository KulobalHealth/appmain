import HeroSection from "@/components/detection/hero";
import WhyWeBuiltSection from "@/components/detection/mission";
import WhatItDoesSection from "@/components/detection/features";
import HowItWorksSection from "@/components/detection/integration";
import IntegrationSteps from "@/components/detection/integration-steps";
import AfricanRealitiesSection from "@/components/detection/solutions";
import ResultsSection from "@/components/detection/results";
import GetStartedSection from "@/components/detection/cta";
import DetectionFooter from "@/components/detection/footer";

export default function DetectionPage() {
  return (
    <>
      <HeroSection />
      <WhyWeBuiltSection />
      <WhatItDoesSection />
      <HowItWorksSection />
      <IntegrationSteps />
      <AfricanRealitiesSection />
      <ResultsSection />
      <GetStartedSection />
      <DetectionFooter />
    </>
  );
}
