import React from "react";
import useAuthData from "../../hooks/useAuthData";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../redux/services/auth/authApiService";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const { user } = useAuthData();
  const navigate = useNavigate()

  // 🔥 fetch full user from API
  const { data: userInfo, isLoading: infoLoading } =
    useGetUserByIdQuery(user?.userId, {
      skip: !user?.userId,
    });

  const [updateUser, { isLoading: updateLoading }] =
    useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      // 👇 API data first priority
      name: userInfo?.data?.name || "",
      email: userInfo?.data?.email || "",
      phone: userInfo?.data?.phone || "",
    },
  });

  // copy userId
  const copyUserId = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId);
      toast.success("User ID copied!");
    }
  };

  // submit handler (REAL API CALL)
 const onSubmit = async (data) => {
  const cleanedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  );

  try {
    await updateUser({
      userId: user?.userId,
      data: cleanedData,
    }).unwrap();

    toast.success("Profile updated successfully 🎉");

    navigate("/account"); 
  } catch (error) {
    toast.error(error?.data?.message || "Update failed ❌");
  }
};

  return (
    <div className="min-h-screen mt-5 text-white font-urbanist">
      {/* Profile */}
      <div className="relative gap-4 bg-gradient-to-br from-purple-700 to-indigo-900 pt-8 pb-6 px-6 rounded-b-[40px] overflow-hidden">
        <div className="w-20 h-20 bg-pink-300 rounded-full border-2 border-white overflow-hidden shadow-inner">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-3">
          <h2 className="text-white font-bold text-lg truncate w-48">
            {userInfo?.data?.name ||
              userInfo?.data?.email ||
              userInfo?.data?.phone ||
              "Anonymous User"}
          </h2>

          <div
            onClick={copyUserId}
            className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 mt-2 border border-white/20 w-fit cursor-pointer"
          >
            <strong className="text-white text-[16px]">
              {user?.userId || "N/A"}
            </strong>
            <Copy size={16} />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 my-4">
        <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
        <h3 className="font-black text-gray-200 text-lg">Edit Profile</h3>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 pb-10">
        {/* Name */}
        <input
          {...register("name", { required: "Name required" })}
          placeholder="UserName"
          className="inputGlass text-[18px]"
        />
        {errors.name && (
          <p className="text-red-400 text-sm">{errors.name.message}</p>
        )}

        {/* Email */}
        <input
          {...register("email", { required: "Email required" })}
          placeholder="Enter email"
          className="inputGlass text-[18px]"
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}

        {/* Phone */}
        <input
          {...register("phone", {
            required: "Phone required",
            validate: (value) => {
              const bdPhoneRegex = /^01[3-9]\d{8}$/;
              if (!bdPhoneRegex.test(value)) {
                return "Enter a valid number (e.g. 01712345678)";
              }
              return true;
            },
          })}
          placeholder="Enter phone number"
          className="inputGlass"
        />
        {errors.phone && (
          <p className="text-red-400 text-sm">{errors.phone.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={updateLoading}
          className="w-full cursor-pointer py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition disabled:opacity-50"
        >
          {updateLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;