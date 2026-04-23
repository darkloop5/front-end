import { baseApi } from "../../api/baseApi";

const paymentApiService = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ CREATE PAYOUT REQUEST
    createPayoutRequest: build.mutation({
      query: (data) => ({
        url: "/payout-request",
        method: "POST",
        body: data,
      }),

      // ✅ MATCH BALANCE TAG
      invalidatesTags: [
        "PayoutRequests",
        { type: "Balance", id: "USER_BALANCE" },
      ],
    }),
    getAllWithdraw: build.query({
      query: (userId) => ({
        url: `/user-payout?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["PayoutRequests"],
    }),
  }),
});

export const { useCreatePayoutRequestMutation, useGetAllWithdrawQuery } =
  paymentApiService;
