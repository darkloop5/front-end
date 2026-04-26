import React from "react";
import { Share2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../../components/GlassCard/GlassCard";
import GlassWithOutBorder from "../../components/GlassCard/GlassWithOutBorder";
import useAuthData from "../../hooks/useAuthData";
import img from "../../assets/icon/link.png";
import { useGetUserBalanceQuery } from "../../redux/services/auth/authApiService";

const Invite = () => {
  const { user } = useAuthData();
  const {
    data: balanceData,
    isLoading,
    isFetching,
  } = useGetUserBalanceQuery(user?.userId, { skip: !user?.userId });

  const referralLink = `https://www.vistatrust.online/signup?invite=${user?.userId}`;
  const referralCode = user?.userId;

  const shareText = `Join VistaTrust & start earning money online $

Sign up using my referral link:
${referralLink}

Don’t miss your daily earning opportunity!`;

  // Copy
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied ✅");
    } catch (err) {
      console.error(err);
    }
  };

  // Share Function
  const handleShare = (platform) => {
    let url = "";

    if (platform === "whatsapp") {
      url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    }

    if (platform === "telegram") {
      url = `https://t.me/share/url?url=${encodeURIComponent(
        referralLink,
      )}&text=${encodeURIComponent("🎉 Join now and earn money!")}`;
    }

    if (platform === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink,
      )}`;
    }

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-full px-4 py-6 text-white font-urbanist">
      {/* HEADER */}
      <div className="text-center">
        {/* HEADER ICON */}
        <div className="flex items-center justify-center cursor-pointer ">
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-purple-400/30 shadow-[0_0_35px_rgba(168,85,247,0.4)] hover:scale-105 transition duration-500">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse"></div>
            <img
              src={img}
              alt="logo"
              width={65}
              className="relative object-contain"
            />
          </div>
        </div>

        <p className="text-sm opacity-70 mt-2">
          Make money for every invite 🎉💰
        </p>

        <h2 className="text-3xl font-bold mt-2">Cash Rewards</h2>
      </div>

      {/* REFERRAL */}
      <GlassCard className="mt-2">
        <h2 className="text-xl font-bold text-center mb-2">
          {isLoading || isFetching ? (
            <div className="flex justify-center">
              <div className="h-6 w-48 bg-white/10 rounded-md animate-pulse"></div>
            </div>
          ) : (
            `Join ${balanceData?.team?.length || 0} People Already Earning 💰`
          )}
        </h2>
        <div className="flex items-center gap-2 text-indigo-300 font-semibold">
          <Share2 size={18} />
          Referral Link
        </div>

        <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-3 py-3">
          <p className="text-xs truncate">{referralLink}</p>

          <button
            onClick={() => handleCopy(referralLink)}
            className="glass-button cursor-pointer"
          >
            <Copy size={16} /> Copy
          </button>
        </div>

        {/* Code */}
        <div className="mt-4">
          <p className="text-sm opacity-60 mb-2">Referral Code</p>

          <div className="flex justify-between items-center border border-dashed border-indigo-400/40 rounded-xl px-4 py-3 bg-white/5">
            <span className="tracking-widest font-semibold text-indigo-300">
              {referralCode}
            </span>

            <Copy
              onClick={() => handleCopy(referralCode)}
              className="cursor-pointer text-indigo-300 hover:scale-110 transition"
            />
          </div>
        </div>
      </GlassCard>

      {/* NOTICE */}
      <div className="relative mt-6 text-center text-sm text-indigo-200/80 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 p-4 shadow-inner">
        Invite friends and earn referral bonus 💰 + 8% commission 📈
      </div>

      {/* SHARE */}
      <GlassWithOutBorder className="mt-6">
        <h3 className="text-indigo-300 font-semibold mb-4">Share to Earn</h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            {
              name: "WhatsApp",
              key: "whatsapp",
              img: "https://cdn-icons-png.flaticon.com/512/15713/15713434.png",
            },
            {
              name: "Telegram",
              key: "telegram",
              img: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png",
            },
            {
              name: "Facebook",
              key: "facebook",
              img: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => handleShare(item.key)}
              className="share-btn flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition"
            >
              <img src={item.img} className="w-8 mx-auto mb-2" />
              <p className="text-[14px]">{item.name}</p>
            </div>
          ))}
        </div>
      </GlassWithOutBorder>
    </div>
  );
};

export default Invite;
