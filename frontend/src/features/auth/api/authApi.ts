import { baseQueryWithReauth } from "@/services/baseQuery";
import type { ApiResponse } from "@/types/api.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { AuthResponseData, LoginRequest } from "../types/auth.types";
import { setCredentials, logout as logoutAction } from "../slices/authSlice";

export const authApi = createApi({
   reducerPath: "authApi",
   baseQuery: baseQueryWithReauth,
   endpoints: (build) => ({
      // login API
      login: build.mutation<ApiResponse<AuthResponseData>, LoginRequest>({
         query: (body) => ({ url: "/auth/login", method: "POST", body }),
         onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
            try {
               // Wait until the API request finishes successfully.
               const { data } = await queryFulfilled;
               dispatch(
                  setCredentials({
                     user: data.data.user,
                     accessToken: data.data.accessToken,
                  }),
               );
            } catch (error) {}
         },
      }),

      // logout API
      logout: build.mutation<ApiResponse<null>, void>({
         query: () => ({ url: "/auth/logout", method: "POST" }),
         onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
            dispatch(logoutAction());
            try {
               await queryFulfilled;
            } catch (error) {}
         },
      }),
   }),
});

export const { useLoginMutation } = authApi;
