import { baseApi } from "../../api/baseApi";

export const redeemApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET REDEEMS
    getRedeems: builder.query({
      query: () => "/redeem",
      providesTags: ["Redeem"],
    }),

    // CREATE REDEEM
    createRedeem: builder.mutation({
      query: (data) => ({
        url: "/redeem-now",
        method: "POST",
        body: data,
      }),

      invalidatesTags: () => [
        // 🔥 THIS MUST MATCH YOUR EXISTING TAG EXACTLY
        { type: "Balance", id: "USER_BALANCE" },

        // optional
        "Redeem",
      ],
    }),

  }),
});

export const {
  useGetRedeemsQuery,
  useCreateRedeemMutation,
} = redeemApiServices;