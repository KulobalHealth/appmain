"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, AlertTriangle, CheckCircle, AlertCircle, Search, Pill, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Common medications database (can be expanded)
const MEDICATIONS_DB = [
  "Aspirin", "Ibuprofen", "Acetaminophen", "Warfarin", "Metformin", "Lisinopril",
  "Amlodipine", "Omeprazole", "Simvastatin", "Levothyroxine", "Metoprolol",
  "Atorvastatin", "Losartan", "Gabapentin", "Hydrochlorothiazide", "Sertraline",
  "Fluoxetine", "Citalopram", "Escitalopram", "Amoxicillin", "Azithromycin",
  "Ciprofloxacin", "Doxycycline", "Prednisone", "Albuterol", "Insulin",
  "Diazepam", "Alprazolam", "Lorazepam", "Tramadol", "Codeine", "Morphine",
  "Paracetamol", "Naproxen", "Celecoxib", "Meloxicam", "Furosemide", "Spironolactone"
];

// Mock interaction checker
const checkInteraction = (drug1: string, drug2: string) => {
  const pair = [drug1.toLowerCase(), drug2.toLowerCase()].sort().join("-");
  
  // Mock serious interactions
  const severeInteractions = [
    "warfarin-aspirin", "warfarin-ibuprofen", "metformin-insulin",
    "fluoxetine-tramadol", "sertraline-tramadol", "warfarin-ciprofloxacin",
    "warfarin-naproxen", "aspirin-ibuprofen"
  ];
  
  // Mock moderate interactions
  const moderateInteractions = [
    "lisinopril-ibuprofen", "metformin-prednisone", "atorvastatin-amlodipine",
    "omeprazole-clopidogrel", "metoprolol-fluoxetine", "lisinopril-spironolactone",
    "furosemide-prednisone", "losartan-ibuprofen"
  ];
  
  if (severeInteractions.includes(pair)) {
    return { 
      severity: "severe", 
      description: "Major interaction detected - may cause serious adverse effects including bleeding, organ damage, or toxic reactions. Immediate medical consultation strongly recommended.",
      recommendation: "Contact your healthcare provider before taking these medications together."
    };
  } else if (moderateInteractions.includes(pair)) {
    return { 
      severity: "moderate", 
      description: "Moderate interaction detected - may reduce effectiveness or increase side effects. Close monitoring required.",
      recommendation: "Inform your doctor or pharmacist. Dosage adjustment may be needed."
    };
  }
  
  return { 
    severity: "minimal", 
    description: "No significant interaction detected based on current data. These medications are generally safe to use together.",
    recommendation: "Continue as prescribed, but always inform your healthcare provider of all medications you're taking."
  };
};

export default function DdiPage() {
  const [medications, setMedications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<Array<{
    drug1: string;
    drug2: string;
    severity: string;
    description: string;
    recommendation: string;
  }>>([]);

  const filteredMedications = MEDICATIONS_DB.filter(med =>
    med.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !medications.includes(med)
  );

  const addMedication = (med: string) => {
    if (!medications.includes(med) && med.trim()) {
      setMedications([...medications, med.trim()]);
      setSearchTerm("");
      setShowSuggestions(false);
      setResults([]); // Clear results when adding new medication
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      if (filteredMedications.length > 0) {
        addMedication(filteredMedications[0]);
      } else {
        // Allow adding custom medication
        addMedication(searchTerm.trim());
      }
    }
  };

  const removeMedication = (med: string) => {
    setMedications(medications.filter(m => m !== med));
    setResults([]);
  };

  const clearAll = () => {
    setMedications([]);
    setResults([]);
    setSearchTerm("");
  };

  const checkInteractions = async () => {
    if (medications.length < 2) return;
    
    setIsChecking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const interactions: Array<{
      drug1: string;
      drug2: string;
      severity: string;
      description: string;
      recommendation: string;
    }> = [];
    
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = checkInteraction(medications[i], medications[j]);
        interactions.push({
          drug1: medications[i],
          drug2: medications[j],
          ...interaction
        });
      }
    }
    
    setResults(interactions);
    setIsChecking(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800";
      case "moderate":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800";
      default:
        return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700";
      default:
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "severe":
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "moderate":
        return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "severe":
        return "Severe";
      case "moderate":
        return "Moderate";
      default:
        return "Minimal";
    }
  };

  const getSeverityCount = () => {
    const severe = results.filter(r => r.severity === "severe").length;
    const moderate = results.filter(r => r.severity === "moderate").length;
    const minimal = results.filter(r => r.severity === "minimal").length;
    return { severe, moderate, minimal };
  };

  const counts = getSeverityCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12 px-4 pt-20 sm:pt-24 md:pt-28">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10 text-center"
        >
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3 sm:mb-4">
            <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Drug Interaction Checker
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Check for potential interactions between your medications. Add multiple drugs to see how they interact and get instant safety information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Input Section */}
          <div className="lg:col-span-2">
            <Card className="lg:sticky lg:top-6 shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-950/30 dark:to-blue-950/30">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="w-5 h-5 text-primary-600" />
                  Add Medications
                </CardTitle>
                <CardDescription className="text-sm">
                  Search from our database or type custom medication names
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <Input
                      placeholder="Search medication (e.g., Aspirin)..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-4 py-6 text-base border-2 focus:border-primary-500 rounded-xl"
                    />
                  </div>

                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && searchTerm && filteredMedications.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto"
                      >
                        {filteredMedications.slice(0, 8).map((med) => (
                          <button
                            key={med}
                            onClick={() => addMedication(med)}
                            className="w-full text-left px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center gap-3"
                          >
                            <Pill className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                            <span className="text-gray-900 dark:text-white font-medium">{med}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Added Medications */}
                {medications.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Selected ({medications.length})
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      <AnimatePresence>
                        {medications.map((med, index) => (
                          <motion.div
                            key={med}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <Pill className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="flex-1 font-medium text-gray-900 dark:text-white">
                              {med}
                            </span>
                            <button
                              onClick={() => removeMedication(med)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-full"
                            >
                              <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Check Button */}
                <div className="mt-6">
                  <Button
                    onClick={checkInteractions}
                    disabled={medications.length < 2 || isChecking}
                    className="w-full py-6 text-base font-bold bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                    size="lg"
                  >
                    {isChecking ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Checking Interactions...
                      </>
                    ) : medications.length < 2 ? (
                      "Add at least 2 medications"
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Check {medications.length} Medications
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results Section */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                      <CardContent className="pt-6 text-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{counts.severe}</p>
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">Severe</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
                      <CardContent className="pt-6 text-center">
                        <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{counts.moderate}</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Moderate</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{counts.minimal}</p>
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">Safe</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Results */}
                  <Card className="shadow-lg border-2">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30 border-b-2">
                      <CardTitle className="text-xl">Interaction Details</CardTitle>
                      <CardDescription>
                        Found {results.length} interaction{results.length !== 1 ? "s" : ""} between your medications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 max-h-[600px] overflow-y-auto">
                      {results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-5 rounded-xl border-2 ${getSeverityColor(result.severity)} shadow-sm hover:shadow-md transition-shadow`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {getSeverityIcon(result.severity)}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                  {result.drug1} + {result.drug2}
                                </h3>
                                <Badge className={`${getSeverityBadgeColor(result.severity)} font-semibold border`}>
                                  {getSeverityLabel(result.severity)}
                                </Badge>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                {result.description}
                              </p>
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                                  Recommendation:
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {result.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-6">
                        <Pill className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        No Results Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        Add at least 2 medications and click "Check Interactions" to see potential drug interactions and safety information.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Important Medical Disclaimer</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                This tool is for informational and educational purposes only. It should not replace professional medical advice, diagnosis, or treatment. 
                Always consult with a qualified healthcare provider or pharmacist before starting, stopping, or changing any medications. 
                Drug interactions can vary based on individual health conditions, dosages, and other factors.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
