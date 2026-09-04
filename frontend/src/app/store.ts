import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import { authApi } from "@/features/auth/api/authApi";
import notesUiReducer from "@/features/notes/slices/notesUiSlice";
import { notesApi } from "@/features/notes/api/notesApi";
import { profileApi } from "@/features/profile/api/profileApi";

export const store = configureStore({
   reducer: {
      auth: authReducer,
      notesUi: notesUiReducer,
      [authApi.reducerPath]: authApi.reducer,
      [notesApi.reducerPath]: notesApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
         authApi.middleware,
         notesApi.middleware,
         profileApi.middleware,
      ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
