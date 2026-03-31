// Single skeleton card
export default function JobCardSkeleton() {
  return (
    <div className="bg-white border-1 shadow-sm border-gray-400 rounded-xl p-3 relative w-[350px] animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-40 bg-gray-400 rounded-lg"></div>
      
      {/* Content skeleton */}
      <div className="mt-2 space-y-1">
        {/* Header with company name and duration */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-400 rounded max-w-[200px] w-3/4"></div>
          <div className="h-6 bg-gray-400 rounded-full px-4 py-1 w-16"></div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 bg-gray-400 rounded"></div>
          <div className="h-3 bg-gray-400 rounded w-24"></div>
        </div>
        
        {/* Date range */}
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 bg-gray-400 rounded"></div>
          <div className="h-3 bg-gray-400 rounded w-32"></div>
        </div>
      </div>
      
      {/* Bottom section skeleton */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {/* Applicants count */}
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-gray-400 rounded"></div>
            <div className="h-4 bg-gray-400 rounded w-20"></div>
          </div>
          
          {/* Division badge */}
          <div className="h-6 bg-gray-400 rounded-full max-w-[150px] w-24 px-2 py-1"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-400 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

// Multiple skeleton cards (untuk grid layout)
export function JobCardsSkeletonGrid({ count = 6, gap = 6 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-${gap}`}>
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}