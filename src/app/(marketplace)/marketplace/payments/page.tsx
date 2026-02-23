"use client";

import { PaymentsTable } from "@/components/marketplace/payments/payments-table";
import Sidebar from "../(orders)/sidebar";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col md:flex-row container mx-auto">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="p-4">
          <h2 className="text-xl font-bold">Payments & Transactions</h2>
        </div>
        <PaymentsTable />
      </div>
    </div>
  );
}
