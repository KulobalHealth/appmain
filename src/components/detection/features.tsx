import { features } from "./data";

export default function WhatItDoesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What it does</h2>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary-50 dark:bg-background">
                <tr>
                  <th className="text-left p-4 font-semibold">Core Feature</th>
                  <th className="text-left p-4 font-semibold">
                    How it helps you
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr key={index} className={"border border-grey-200"}>
                    <td className="p-4 font-medium">{item.feature}</td>
                    <td className="p-4">{item.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
