import React, { useEffect, useState } from "react";
import GlassCard from "../../components/GlassCard/GlassCard";
import {
  useAddPaymentMutation,
  useGetMethodsQuery,
} from "../../redux/services/payment/paymentApiService";
import useAuthData from "../../hooks/useAuthData";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";

import bkashIcon from "../../assets/icon/bkash.svg";
import nagadIcon from "../../assets/icon/nagad.png";
import { useNavigate } from "react-router-dom";

const Deposit = () => {
  const [addPayment, { isLoading }] = useAddPaymentMutation();
  const { user } = useAuthData();
  const { data: paymentMethod, isLoading: methodLoading } =
    useGetMethodsQuery();
  const navigate = useNavigate();

  // ✅ TAB STATE
  const [activeTab, setActiveTab] = useState("bkash");
  const [paymentAgent, setPaymentAgent] = useState(null);


  // ✅ RANDOM AGENT BASED ON TAB
  useEffect(() => {
    const data = paymentMethod?.data;
    if (!data || data.length === 0) return;

    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(activeTab),
    );

    if (filtered.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filtered.length);
    setPaymentAgent(filtered[randomIndex]);
  }, [paymentMethod?.data, activeTab]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!user?.userId) {
      toast.error("User not authenticated");
      return;
    }

    const paymentData = {
      transactionId: data.transactionId,
      amount: Number(data.amount),
      method: activeTab, // ✅ FIXED
      status: "Pending",
      userId: user.userId,
      number : paymentAgent?.number ?? "Missing"
    };

    try {
      await addPayment(paymentData).unwrap();
      toast.success("✅ Deposit Submitted Successfully");
      reset();
      navigate("/invoice");
    } catch (error) {
      console.error(error);
      toast.error("❌ Deposit Failed");
    }
  };

  // ✅ ICON
  const icon =
    activeTab === "bkash"
      ? bkashIcon
      : activeTab === "nagad"
        ? nagadIcon
        : null;

  // ✅ LOADING
  if (methodLoading || !paymentAgent) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="bg-white/5 rounded-3xl p-6">
          <div className="w-40 h-20 mx-auto bg-white/10 rounded-xl mb-5" />
          <div className="space-y-3 text-center">
            <div className="h-6 w-40 mx-auto bg-white/10 rounded" />
            <div className="h-5 w-52 mx-auto bg-white/10 rounded" />
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 space-y-4">
          <div className="h-12 bg-white/10 rounded-xl" />
          <div className="h-12 bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="px-4 relative z-10 mt-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl p-4 border-l-[6px] border-purple-600">
          {/* ✅ TABS */}
          <div className="flex justify-center gap-4 mt-2">
            {/* bKash */}
            <button
              onClick={() => setActiveTab("bkash")}
              className="relative px-6 py-2 rounded-xl font-bold text-white group overflow-hidden cursor-pointer"
            >
              {/* Glow background */}
              <span
                className={`absolute inset-0 rounded-xl blur-xl opacity-70 transition-all duration-500 ${
                  activeTab === "bkash"
                    ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 scale-110"
                    : "bg-white/10 opacity-30"
                }`}
              />

              {/* Neon border */}
              <span
                className={`absolute inset-0 rounded-xl border transition-all duration-500 ${
                  activeTab === "bkash"
                    ? "border-pink-400 shadow-[0_0_15px_#ff4ecd,0_0_30px_#ff4ecd]"
                    : "border-white/20"
                }`}
              />

              {/* Content */}
              <span className="relative z-10 tracking-wide">bKash</span>
            </button>

            {/* Nagad */}
            <button
              onClick={() => setActiveTab("nagad")}
              className="relative px-6 py-2 rounded-xl font-bold text-white group overflow-hidden cursor-pointer"
            >
              {/* Glow background */}
              <span
                className={`absolute inset-0 rounded-xl blur-xl opacity-70 transition-all duration-500 ${
                  activeTab === "nagad"
                    ? "bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 scale-110"
                    : "bg-white/10 opacity-30"
                }`}
              />

              {/* Neon border */}
              <span
                className={`absolute inset-0 rounded-xl border transition-all duration-500 ${
                  activeTab === "nagad"
                    ? "border-orange-400 shadow-[0_0_15px_#ff9a00,0_0_30px_#ff9a00]"
                    : "border-white/20"
                }`}
              />

              {/* Content */}
              <span className="relative z-10 tracking-wide">Nagad</span>
            </button>
          </div>

          {icon && (
            <div className="flex justify-center">
              <img
                src={icon}
                alt="agent icon"
                className="w-40 h-20 object-contain"
              />
            </div>
          )}

          <div className="text-center">
            <h3 className="font-bold text-2xl text-white mb-2">
              {paymentAgent?.name}
            </h3>

            <p className="text-white text-xl font-bold">
              Number:{" "}
              <span className="font-medium">{paymentAgent?.number}</span>
            </p>

            <p className="text-white text-lg font-semibold">
              Type: <span className="font-medium">{paymentAgent?.type}</span>
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="p-4">
        <form
          className="bg-white/5 px-6 space-y-3 py-6 backdrop-blur-md rounded-3xl"
          onSubmit={handleSubmit(onSubmit)}
        >
        <h3 className="text-center font-extrabold text-xl bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md"> Minimum Deposit ৳1000 </h3>
          <div>
            <input
              {...register("transactionId", {
                required: "Transaction ID required",
              })}
              placeholder="Enter Transaction ID"
              className="inputGlass"
            />
            {errors.transactionId && (
              <p className="error">{errors.transactionId.message}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              {...register("amount", {
                required: "Amount required",
                min: {
                  value: 1000,
                  message: "Minimum Deposit ৳1000",
                },
              })}
              placeholder="Enter Amount"
              className="inputGlass"
            />
            {errors.amount && (
              <p className="error font-semibold">{errors.amount.message}</p>
            )}
          </div>

          <button
            disabled={isLoading}
            className="w-full py-4 cursor-pointer text-white rounded-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 flex justify-center items-center gap-2"
          >
            {isLoading && <ImSpinner2 className="animate-spin" size={20} />}
            {isLoading ? "Processing..." : "Submit Deposit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Deposit;
