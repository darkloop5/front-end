import { baseApi } from "../../api/baseApi";

export const authApiService = baseApi.injectEndpoints({
  tagTypes: ["User", "Balance"],

  endpoints: (build) => ({
    // GET USER BALANCE
    getUserBalance: build.query({
      query: (userId) => `/user/balance/${userId}`,
      providesTags: [{ type: "Balance", id: "USER_BALANCE" }],
    }),

    // GET USER BY ID
    getUserById: build.query({
      query: (userId) => `/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "User", id: userId },
      ],
    }),

    // CREATE USER
    createUser: build.mutation({
      query: (userData) => ({
        url: "/create-user",
        method: "POST",
        body: userData,
      }),
    }),

    // LOGIN USER
    loginUser: build.mutation({
      query: (loginData) => ({
        url: "/login",
        method: "POST",
        body: loginData,
      }),
    }),

    // UPDATE USER
    updateUser: build.mutation({
      query: ({ userId, data }) => ({
        url: `/update-user/${userId}`,
        method: "PATCH", // or PUT depending on backend
        body: data,
      }),

      // 🔥 THIS TRIGGERS AUTO REFETCH
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useGetUserBalanceQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = authApiService;