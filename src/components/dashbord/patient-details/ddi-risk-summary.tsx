import { AlertTriangle, RefreshCw, ShieldCheck, X } from "lucide-react"
import { useState } from "react"

interface DDIRisk {
  severity: "high" | "moderate" | "low"
  title: string
  description: string
  recommendations: string[]
}

interface DDIRiskSummaryProps {
  risks?: DDIRisk[]
  patientName?: string
  onRunAnalysis?: () => void
  isAnalyzing?: boolean
}

export function DDIRiskSummary({ risks = [], patientName, onRunAnalysis, isAnalyzing = false }: DDIRiskSummaryProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // If no risks or dismissed, show a "Run Analysis" button instead
  if (risks.length === 0 || isDismissed) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/20 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-200 text-sm">
                DDI Risk Analysis
              </h3>
              <p className="text-xs text-green-700 dark:text-green-400">
                {isDismissed ? "Analysis dismissed" : "No drug interactions detected"}
              </p>
            </div>
          </div>
          {onRunAnalysis && (
            <button
              onClick={() => {
                setIsDismissed(false)
                onRunAnalysis()
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </button>
          )}
        </div>
      </div>
    )
  }

  const highRisks = risks.filter(r => r.severity === "high")
  const moderateRisks = risks.filter(r => r.severity === "moderate")
  const hasHighRisk = highRisks.length > 0

  return (
    <div className="relative rounded-lg border-2 border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 p-4 mb-4 animate-in slide-in-from-top duration-300">
      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md transition-colors"
        title="Dismiss"
      >
        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-red-900 dark:text-red-200">
            DDI Risk Alert {patientName ? `for ${patientName}` : ""}
          </h3>
          <p className="text-xs text-red-700 dark:text-red-400">
            {highRisks.length} high risk{highRisks.length !== 1 ? "s" : ""}, {moderateRisks.length} moderate risk{moderateRisks.length !== 1 ? "s" : ""} detected
          </p>
        </div>
      </div>

      {/* High Risks */}
      {highRisks.map((risk, index) => (
        <div key={`high-${index}`} className="rounded-md border border-red-300 bg-white dark:border-red-800 dark:bg-red-950/40 p-3 mb-2">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
            <div className="font-medium text-sm text-red-900 dark:text-red-200">{risk.title}</div>
          </div>
          <p className="text-xs text-red-800 dark:text-red-300 mb-2 pl-6">
            {risk.description}
          </p>
          {risk.recommendations.length > 0 && (
            <div className="pl-6">
              <div className="text-xs font-medium mb-1 text-red-900 dark:text-red-200">Recommendations:</div>
              <ul className="text-xs text-red-800 dark:text-red-300 list-disc pl-4 space-y-0.5">
                {risk.recommendations.slice(0, 2).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Moderate Risks */}
      {moderateRisks.map((risk, index) => (
        <div key={`mod-${index}`} className="rounded-md border border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/40 p-3 mb-2">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="font-medium text-sm text-yellow-900 dark:text-yellow-200">{risk.title}</div>
          </div>
          <p className="text-xs text-yellow-800 dark:text-yellow-300 pl-6">
            {risk.description}
          </p>
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-3">
        {onRunAnalysis && (
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Run Again'}
          </button>
        )}
        <a
          href="/ddi"
          className="text-xs font-medium text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 underline ml-auto"
        >
          View Full DDI Analysis →
        </a>
      </div>
    </div>
  )
}

// Demo data for testing - can be removed in production
export const demoRisks: DDIRisk[] = [
  {
    severity: "high",
    title: "High Risk: Aspirin + Warfarin Interaction",
    description: "The combination significantly increases bleeding risk. Both medications affect blood clotting through different mechanisms.",
    recommendations: [
      "Consider alternative to Aspirin such as Acetaminophen",
      "If both necessary, reduce Warfarin dosage and monitor INR closely"
    ]
  },
  {
    severity: "moderate", 
    title: "Moderate Risk: Lisinopril + Metformin",
    description: "ACE inhibitors may enhance blood glucose-lowering effect of Metformin, increasing hypoglycemia risk.",
    recommendations: [
      "Monitor blood glucose levels more frequently"
    ]
  }
]

