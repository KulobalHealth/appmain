export default function WhyWeBuiltSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why we built it
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="border-l-4 border-red-500 pl-6 bg-red-50 p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              Medication errors remain a top cause of avoidable harm in African
              pharmacies. Most retail and hospital systems cannot check
              interactions quickly or at all. <strong>Kulabal DDI API</strong>{" "}
              drops evidence-based safety checks straight into the software and
              mobile apps that pharmacists, prescribers, and tele-health
              platforms already use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
