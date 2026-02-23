import { AnimationWrapper } from "@/components/ui/animation-wrapper";

export default function ImpactMap() {
  return (
    <section
      className="relative py-16 text-center bg-center bg-no-repeat  font-urbanist"
      style={{
        backgroundImage: `url(/images/map.556e50b3b61d.webp)`,
      }}
    >
      <div className="container px-4 py-16 mx-auto">
        <AnimationWrapper>
          <div className="pt-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-3 text-sm uppercase text-primary">
                Our Impact
              </h2>
              <h4 className="px-4 mb-8 text-4xl md:text-5xl lg:px-12">
                Improving Access to Medicines in Africa
              </h4>
            </div>
          </div>

          <div className="pb-12">
            <div className="max-w-3xl mx-auto">
              <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <h3 className="text-3xl font-bold md:text-4xl text-primary">
                    17
                  </h3>
                  <p className="mt-2">Pharmacies</p>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl font-bold md:text-4xl text-primary">
                    2,318
                  </h3>
                  <p className="mt-2">Test Kits Supplied</p>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl font-bold md:text-4xl text-primary">
                    103
                  </h3>
                  <p className="mt-2">Patients Served</p>
                </div>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}
