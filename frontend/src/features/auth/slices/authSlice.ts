import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "../types/auth.types";
import { tokenService } from "@/services/tokenService";

const initialState: AuthState = {
   user: null,
   isInitialized: false,
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      // store the access token and update the user state
      setCredentials(
         state,
         action: PayloadAction<{ user: AuthUser; accessToken: string }>,
      ) {
         state.user = action.payload.user;
         tokenService.setToken(action.payload.accessToken);
      },

      logout(state) {
         state.user = null;
         tokenService.clearToken();
      },
   },
   extraReducers: (builder) => {},
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
