export const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">

      {/* VIDEO AREA */}
      <div className="w-full aspect-video bg-gradient-to-br from-white/10 via-white/5 to-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>

      {/* TEXT AREA */}
      <div className="p-5 space-y-4">

        {/* TITLE */}
        <div className="h-5 w-3/4 rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>

        {/* DESCRIPTION */}
        <div className="h-4 w-full rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse"></div>
        </div>

        <div className="h-4 w-2/3 rounded bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse"></div>
        </div>

        {/* BUTTON PLACEHOLDER */}
        <div className="h-8 w-24 rounded-full bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>

      </div>
    </div>
  );
};