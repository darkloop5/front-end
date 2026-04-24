import { baseApi } from "../../api/baseApi";

export const redeemApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Get all redeems
    getRedeems: builder.query({
      query: () => "/redeem",
      providesTags: ["Redeem"],
    }),

    
    createRedeem: builder.mutation({
      query: (data) => ({
        url: "/redeem-now",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Redeem", "Users"], // auto refresh data
    }),

  }),
});

export const {
  useGetRedeemsQuery,
  useCreateRedeemMutation, // ✅ export mutation hook
} = redeemApiServices;