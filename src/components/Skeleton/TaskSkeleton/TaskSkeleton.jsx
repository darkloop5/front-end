export const TaskSkeleton = () => {
  return (
    <div className="space-y-3 mt-3 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl p-4 flex items-center gap-3 bg-white/10 backdrop-blur-md"
        >
          {/* Icon Skeleton */}
          <div className="w-12 h-12 rounded-xl bg-white/20"></div>

          {/* Text Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-white/20 rounded"></div>
            <div className="h-6 w-20 bg-white/20 rounded"></div>
          </div>

          {/* Button Skeleton */}
          <div className="h-8 w-20 rounded-lg bg-white/20"></div>
        </div>
      ))}

      {/* Progress Skeleton */}
      <div className="bg-white/10 rounded-2xl p-4 space-y-2">
        <div className="h-4 w-40 bg-white/20 rounded"></div>
        <div className="h-2 w-full bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};