import React from "react";
import {
  useCreateRedeemMutation,
} from "../../redux/services/redeem/redeemApiServices";

import useAuthData from "../../hooks/useAuthData";
import { useGetUserBalanceQuery } from "../../redux/services/auth/authApiService";
import toast from "react-hot-toast";

const RedeemCard = ({ redeem }) => {
  const { user } = useAuthData();

  const [createRedeem, { isLoading }] = useCreateRedeemMutation();

  const {
    data: balanceData,
    isFetching,
    
    
  } = useGetUserBalanceQuery(user?.userId, {
    skip: !user?.userId,
  });

  // loading state UI
  if (isFetching) {
    return (
      <div className="w-full max-w-md mx-auto animate-pulse">
        <div className="rounded-3xl p-4 bg-[#0B0614]">
          <div className="w-20 h-20 bg-gray-700 rounded-md mx-auto mb-4"></div>
          <div className="h-5 w-32 bg-gray-700 mx-auto mb-3 rounded"></div>
          <div className="h-3 w-full bg-gray-700 mb-2 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-700 mx-auto mb-4 rounded"></div>
          <div className="h-10 w-40 bg-gray-700 mx-auto rounded-xl"></div>
          <div className="h-3 w-28 bg-gray-700 mx-auto mt-4 rounded"></div>
        </div>
      </div>
    );
  }

  // check already redeemed from DB
  const isRedeemed = balanceData?.redeemedItems?.some(
    (item) => item.redeemId === redeem._id
  );



const handleRedeem = async () => {
  if (isRedeemed) return;

  try {
    const res = await createRedeem({
      redeemId: redeem._id,
      amount: redeem.amount,
      userId: user?.userId,
    }).unwrap();


    toast.success(res?.message || "Redeem successful!");
    
  } catch (error) {
    console.log(error);

    // RTK Query error handling
    const message =
      error?.data?.message ||
      error?.message ||
      "Something went wrong!";

    toast.error(message);
  }
};

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-full max-w-md mx-auto font-urbanist">
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 shadow-xl">

        <div className="bg-[#0B0614] rounded-3xl p-4 relative overflow-hidden">

          {/* image */}
          <div className="flex justify-center mb-4 w-20 h-20 mx-auto rounded-md">
            <img
              src={redeem?.image}
              className="w-full h-full rounded-md cursor-pointer"
              alt="redeem"
            />
          </div>

          {/* title */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-orange-400 font-bold text-lg">
              {redeem?.title}
            </span>
          </div>

          {/* description */}
          <p className="text-center text-white/70 text-sm mb-4">
            {redeem?.description}
          </p>

          {/* button */}
          <div className="flex justify-center">
            <button
              onClick={handleRedeem}
              disabled={isRedeemed || isLoading}
              className={`px-6 py-2 rounded-xl text-white font-semibold transition 
                ${
                  isRedeemed
                    ? "bg-gray-600 cursor-not-allowed cu"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 shadow-md hover:scale-105 transition cursor-pointer"
                }
              `}
            >
              {isRedeemed
                ? "Already Redeemed"
                : isLoading
                ? "Processing..."
                : "Redeem Now"}
            </button>
          </div>

          {/* date */}
          <p className="text-center text-red-400 text-xs mt-4">
            Expired on {formatDate(redeem?.date)}
          </p>

        </div>
      </div>
    </div>
  );
};

export default RedeemCard;