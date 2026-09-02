import {
   fetchBaseQuery,
   type BaseQueryFn,
   type FetchArgs,
   type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { tokenService } from "./tokenService";
import type { AppDispatch } from "@/app/store";
import { logout } from "@/features/auth/slices/authSlice";

// Use RTK queries to send HTTP requests to the backend

// Raw base query  - attach access token, include cookies, include header to indicate the request is coming from our SPA
export const rawBaseQuery = fetchBaseQuery({
   baseUrl: (import.meta.env.VITE_API_BASE_URL || "") + "/api",
   prepareHeaders: (headers) => {
      //attach the token from in-memory
      const token = tokenService.getToken();
      if (token) {
         headers.set("Authorization", `Bearer ${token}`);
      }

      // CSRF defence - tell server this request came from our SPA(Single Page Application)
      headers.set("X-Requested-With", "XMLHttpRequest");
      return headers;
   },
   credentials: "include",
});

// To prevent multiple refresh requests at the same time (which would waste API calls),
let _refreshPromise: ReturnType<typeof rawBaseQuery> | null = null;

// Send API requests, if occurs 401 error try to refresh the access token and retry the request, if it fails log out the user
export const baseQueryWithReauth: BaseQueryFn<
   string | FetchArgs,
   unknown,
   FetchBaseQueryError
> = async (args, api, extraOptions) => {
   // Execute original request
   let result = await rawBaseQuery(args, api, extraOptions);

   const url = typeof args === "string" ? args : args.url;

   //  Handle 401 Unauthorized (try to get new access token)
   if (
      result.error?.status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/refresh")
   ) {
      // If a refresh is not already in progress, start one
      if (!_refreshPromise) {
         _refreshPromise = rawBaseQuery(
            { url: "/auth/refresh", method: "POST" },
            api,
            extraOptions,
         );
      }
      // Wait for the refresh promise (either the one we just started, or one already in flight)
      const refreshResult = await _refreshPromise!;

      // Clear the promise so subsequent 401s can trigger a new refresh if needed
      // (This runs for every waiting call, but resetting to null is idempotent)
      _refreshPromise = null;

      if ("data" in refreshResult && refreshResult.data) {
         // store the access token
         const payload = refreshResult.data as {
            data: { accessToken: string };
         };
         tokenService.setToken(payload.data.accessToken);

         // retry the original request
         result = await rawBaseQuery(args, api, extraOptions);
      } else {
         // refresh failed -> logout locally
         (api.dispatch as AppDispatch)(logout());
         // Logout from backend to ensure HTTP-only cookies (like refresh token) are cleared
         await rawBaseQuery(
            { url: "/auth/logout", method: "POST" },
            api,
            extraOptions,
         );
      }
   }

   return result;
};
