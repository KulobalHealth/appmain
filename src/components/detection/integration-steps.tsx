import { integrationSteps } from "./data";

export default function IntegrationSteps() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-12">3-step integration</h3>{" "}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {integrationSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div
                  className={`w-12 h-12 ${step.bgColor} ${step.textColor} rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4`}
                >
                  {step.number}
                </div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-8">
            SDKs and sample components are available on GitHub.
          </p>
        </div>
      </div>
    </section>
  );
}
