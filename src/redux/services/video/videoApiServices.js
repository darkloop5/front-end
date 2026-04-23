import { baseApi } from "../../api/baseApi";



export const videoApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //  GET all videos
    getVideos: builder.query({
      query: () => "/videos",
      providesTags: ["Videos"],
    }),

  


   
  }),
});

// 👉 Export hooks
export const {
  useGetVideosQuery,

 
} = videoApiServices;