import { Badge } from "@/components/ui/badge";
import { requestData, responseData } from "./data";

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-primary-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary-100 rounded-full text-[#166534] font-bold">
                Request
              </Badge>
              <span className="font-semibold">API Call</span>
            </div>
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
              {requestData.map((line, index) => (
                <div key={index} className={index > 0 ? "mt-1" : ""}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-[#DBEAFE] rounded-full text-[#1E40AF] font-bold">
                Response
              </Badge>
              <span className="font-semibold">API Response</span>
            </div>
            <div className="bg-gray-900 text-blue-400 p-6 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
              {responseData.map((line, index) => (
                <div key={index} className={index > 0 ? "mt-1" : ""}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
