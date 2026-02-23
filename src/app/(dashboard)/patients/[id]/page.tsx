"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Microscope,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Calendar,
  Pill,
  Activity
} from "lucide-react";
import { patients } from "@/lib/data";
import { useState } from "react";

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const patient = patients.find((patient) => patient.id === Number(id));
  const [activeTab, setActiveTab] = useState("medications");

  if (!patient) {
    notFound();
  }

  // Patient data will come from API
  const patientData = {
    name: patient?.name || "N/A",
    age: 0, // Will come from API
    gender: patient?.gender || "N/A",
    phone: patient?.telephone || "N/A",
    email: "N/A", // Will come from API
    address: patient?.location || "N/A",
    medicalConditions: [] as string[],
    allergies: [] as string[],
    medications: [] as Array<{
      name: string;
      dosage: string;
      frequency: string;
      startDate: string;
      endDate: string;
    }>,
    testResults: [] as Array<{
      test: string;
      result: string;
      date: string;
      status: string;
    }>
  };

  const ddiRisks: Array<{
    level: string;
    title: string;
    description: string;
    recommendations: string[];
  }> = [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/patients">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patientData.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {patientData.gender}
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {patientData.age} years
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Information - Left Column */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold">Patient Information</CardTitle>
              </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Contact Information */}
                <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patientData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patientData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patientData.address}</span>
                  </div>
                </div>
                  </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Medical Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Medical Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {patientData.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {patientData.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="bg-red-100 text-red-800">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  New Prescription
                </Button>
                <Button variant="outline" className="gap-2">
                  <Microscope className="w-4 h-4" />
                  New Rapid Test
                </Button>
                      </div>
            </CardContent>
          </Card>

          {/* Health Records - Right Column */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold">Health Records</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="medications" className="flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Medications
                  </TabsTrigger>
                  <TabsTrigger value="test-results" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Test Results
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="medications" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Current Medications</h3>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Plus className="w-4 h-4" />
                      Add Medication
                    </Button>
                    </div>

                  <div className="space-y-3">
                    {patientData.medications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No medications recorded</p>
                      </div>
                    ) : (
                      patientData.medications.map((med, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{med.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {med.dosage}
                          </Badge>
                        </div>
                        {med.frequency && <p className="text-sm text-gray-600 mb-2">{med.frequency}</p>}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {med.startDate && <span>Started: {med.startDate}</span>}
                          {med.endDate && <span>End: {med.endDate}</span>}
                        </div>
                      </div>
                    ))
                    )}
                    </div>

                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Potential interaction with Warfarin.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="test-results" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Test Results</h3>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Plus className="w-4 h-4" />
                      Add Test
                    </Button>
                    </div>

                  <div className="space-y-3">
                    {patientData.testResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No test results recorded</p>
                      </div>
                    ) : (
                      patientData.testResults.map((test: {test: string; result: string; date: string; status: string}, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{test.test}</h4>
                          <Badge 
                            variant={test.status === "High" ? "destructive" : "secondary"}
                            className={test.status === "High" ? "bg-red-100 text-red-800" : ""}
                          >
                            {test.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{test.result}</p>
                        <p className="text-xs text-gray-500">{test.date}</p>
                      </div>
                    ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
                    </div>

        {/* DDI Risk Summary - Full Width */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold">
              AI-generated drug interaction analysis and recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {ddiRisks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No drug interaction risks detected</p>
              </div>
            ) : (
              ddiRisks.map((risk, index) => (
              <div key={index} className={`rounded-lg p-4 border ${
                risk.level === "high" 
                  ? "border-red-200 bg-red-50" 
                  : "border-yellow-200 bg-yellow-50"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-1 rounded-full ${
                    risk.level === "high" ? "bg-red-100" : "bg-yellow-100"
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      risk.level === "high" ? "text-red-600" : "text-yellow-600"
                    }`} />
                      </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-2 ${
                      risk.level === "high" ? "text-red-900" : "text-yellow-900"
                    }`}>
                      {risk.title}
                    </h4>
                    <p className={`text-sm mb-4 ${
                      risk.level === "high" ? "text-red-800" : "text-yellow-800"
                    }`}>
                      {risk.description}
                    </p>
                    <div className="space-y-2">
                      <h5 className={`font-medium text-sm ${
                        risk.level === "high" ? "text-red-900" : "text-yellow-900"
                      }`}>
                        Recommendations:
                      </h5>
                      <ul className={`space-y-1 text-sm ${
                        risk.level === "high" ? "text-red-800" : "text-yellow-800"
                      }`}>
                        {risk.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start gap-2">
                            <span className="text-xs mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  </div>
                  </div>
            ))
            )}
              </CardContent>
            </Card>
          </div>
        </div>
  );
}