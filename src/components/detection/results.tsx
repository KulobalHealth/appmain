import { Card } from "@/components/ui/card";
import { results, securityFeatures } from "./data";

export default function ResultsSection() {
  return (
    <section className="bg-green-50 dark:bg-background py-16">
      <div className="container flex flex-col gap-16 mx-auto px-4">
        <div className="bg-white dark:bg-background rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Security & compliance
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <feature.icon className="w-6 h-6 text-[#03C486]" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Results that matter
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {results.map((result, index) => (
              <Card key={index} className="text-center p-8">
                <result.icon
                  className={`w-16 h-16 ${result.color} mx-auto mb-4`}
                />
                <div className={`text-4xl font-bold ${result.color} mb-2`}>
                  {result.value}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {result.description}
                </p>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8 dark:text-gray-400">
            *12-month field study, Greater Accra
          </p>
        </div>
      </div>
    </section>
  );
}
