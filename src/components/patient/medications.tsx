import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Medication } from "@/lib/data";

interface PatientMedicationsProps {
  medications: Medication[];
}

export function PatientMedications({
  medications = [],
}: PatientMedicationsProps) {
  return (
    <div className="border rounded-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Medications</h2>
        <div className="flex space-x-2">
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Add Medication
          </Button>
        </div>
      </div>

      {medications.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left font-medium">Name</th>
                <th className="p-2 text-left font-medium">Category</th>
                <th className="p-2 text-left font-medium">Type</th>
                <th className="p-2 text-left font-medium">Brand</th>
                <th className="p-2 text-left font-medium">Prescribed By</th>
                <th className="p-2 text-left font-medium">Dosage</th>
                <th className="p-2 text-left font-medium">Route</th>
                <th className="p-2 text-left font-medium">Date Started</th>
                <th className="p-2 text-left font-medium">Status</th>
                <th className="p-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((medication) => (
                <tr key={medication.id} className="border-t hover:bg-muted/30">
                  <td className="p-2 font-medium">{medication.name}</td>
                  <td className="p-2">{medication.category}</td>
                  <td className="p-2">{medication.type}</td>
                  <td className="p-2">{medication.brand}</td>
                  <td className="p-2">{medication.prescribedBy}</td>
                  <td className="p-2">{medication.dosage}</td>
                  <td className="p-2">{medication.route}</td>
                  <td className="p-2">{medication.dateStarted}</td>
                  <td className="p-2">
                    <Badge
                      className={
                        medication.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                          : medication.status === "Discontinued"
                          ? "bg-rose-100 text-rose-800 hover:bg-rose-100"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }
                    >
                      {medication.status}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-rose-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 border rounded-md bg-muted/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground mx-auto mb-4"
          >
            <path d="m19 21-4-4"></path>
            <path d="m21 19-4-4"></path>
            <path d="M9 11a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"></path>
            <path d="M5 5a4 4 0 0 1 4-4c1.5 0 3 .5 4 2 1-1.5 2.5-2 4-2a4 4 0 0 1 4 4c0 6-8 12-8 12S5 11 5 5Z"></path>
          </svg>
          <p className="text-xl font-medium">No medications</p>
          <p className="text-muted-foreground mb-4">
            This patient doesn&apos;t have any medications recorded
          </p>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Add Medication
          </Button>
        </div>
      )}
    </div>
  );
}
