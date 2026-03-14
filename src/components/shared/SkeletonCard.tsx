export function SkeletonCard() {
  return (
    <div className="border-2 border-black bg-gray-200 shadow-shadow rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
      <div className="h-8 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded mt-6"></div>
    </div>
  )
}
