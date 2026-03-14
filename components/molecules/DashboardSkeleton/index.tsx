const S = "animate-pulse rounded-2xl bg-[#F1F5F9]"

export function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <div className="h-6 w-40 animate-pulse rounded bg-[#F1F5F9]" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[#F1F5F9]" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`h-[140px] ${S}`} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className={`h-[320px] lg:col-span-2 ${S}`} />
        <div className={`h-[320px] lg:col-span-1 ${S}`} />
      </div>
    </div>
  )
}
