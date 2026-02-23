interface StatCardProps {
  title: string;
  value: number;
  status: string;
  statusColor?: string;
}

export function StatCard({
  title,
  value,
  status,
  statusColor = "text-emerald-500",
}: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">
            {title}
          </p>
          <h2 className="text-4xl font-bold">{value}</h2>
        </div>
        <span className={`text-sm ${statusColor}`}>{status}</span>
      </div>
    </div>
  );
}
