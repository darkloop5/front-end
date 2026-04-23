import React from "react";
import image from "../../assets/icon/video.png";
import { useGetVideosQuery } from "../../redux/services/video/videoApiServices";
import { SkeletonCard } from "../../components/Skeleton/SkeletonCard/SkeletonCard";



const Tutorial = () => {
  const { data: videoData, isLoading } = useGetVideosQuery();

  const allVideos = videoData?.videos || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b061a] via-[#120a2e] to-[#070012] text-white p-4 font-urbanist">

      {/* HEADER ICON */}
      <div className="flex items-center justify-center cursor-pointer mb-8">
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-purple-400/30 shadow-[0_0_35px_rgba(168,85,247,0.4)] hover:scale-105 transition duration-500">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse"></div>
          <img src={image} alt="logo" className="relative w-[100px] h-[100px] object-contain" />
        </div>
      </div>

      {/* VIDEO LIST */}
      <div className="space-y-6">

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
          <h3 className="font-black text-gray-200 text-lg">
            Learn How to Earn & Get Paid 💰🚀
          </h3>
        </div>

        {/* LOADING SKELETON */}
        {isLoading && (
          <div className="space-3-6">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && allVideos.length === 0 && (
          <p className="text-gray-400 text-center">No videos found</p>
        )}

        {/* REAL DATA */}
        {!isLoading &&
          allVideos.map((video) => (
            <div
              key={video._id}
              className="rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
            >
              {/* VIDEO */}
              <div className="relative w-full aspect-video">
                <iframe
                  src={video?.videoUrl}
                  title={video.title}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-2">
                <h2 className="text-xl font-bold">{video.title}</h2>
                <p className="text-gray-300 text-sm">
                  {video.description || "Watch this tutorial video"}
                </p>
              </div>
            </div>
          ))}

      </div>
    </div>
  );
};

export default Tutorial;