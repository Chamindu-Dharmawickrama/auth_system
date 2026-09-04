import { useEffect, useRef, useState } from "react";
import "./GoogleSignInButton.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleSignInMutation } from "../api/authApi";
import { ROUTES } from "@/constants/app.constants";
import {
   cancelGoogleSignIn,
   initializeGoogleSignIn,
   loadGoogleScript,
   renderGoogleButton,
   type CredentialResponse,
} from "@/services/googleAuthService";
import { getErrorMessage } from "@/types/api.types";

export function GoogleSignInButton() {
   const buttonRef = useRef<HTMLDivElement>(null);
   const navigate = useNavigate();
   const location = useLocation();

   const [isScriptLoading, setIsScriptLoading] = useState(true);
   const [scriptError, setScriptError] = useState<string | null>(null);

   const [googleSignIn, { isLoading: isSigningIn, error: apiError }] =
      useGoogleSignInMutation();

   const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      ROUTES.DASHBOARD;

   // Handle the credential callback from GIS
   const handleCredential = async (response: CredentialResponse) => {
      try {
         // `response.credential` is the Google-signed idToken JWT
         await googleSignIn({ idToken: response.credential }).unwrap();
         navigate(from, { replace: true });
      } catch {
         // API error is surfaced via `apiError` from RTK Query
      }
   };

   // load GIS script, int
   useEffect(() => {
      let cancelled = false;

      async function setup() {
         try {
            await loadGoogleScript();
            if (cancelled) return;

            initializeGoogleSignIn(handleCredential);

            if (buttonRef.current && !cancelled) {
               renderGoogleButton(buttonRef.current);
            }

            setIsScriptLoading(false);
         } catch (err) {
            if (!cancelled) {
               setScriptError(
                  err instanceof Error
                     ? err.message
                     : "Google Sign-In is unavailable.",
               );
               setIsScriptLoading(false);
            }
         }
      }

      setup();

      return () => {
         cancelled = true;
         cancelGoogleSignIn();
      };
   }, []);

   const apiErrorMessage = getErrorMessage(apiError);
   const error = scriptError ?? apiErrorMessage;

   return (
      <div className="google-signin-wrapper">
         {/* Error banner */}
         {error && (
            <p className="google-signin-error" role="alert">
               {error}
            </p>
         )}

         {/* Loading skeleton shown while the GIS script is fetched */}
         {isScriptLoading && !scriptError && (
            <div className="google-signin-skeleton" aria-hidden="true">
               <div className="google-signin-skeleton-icon" />
               <span className="google-signin-skeleton-text">
                  Loading Google Sign-In…
               </span>
            </div>
         )}

         {/* The GIS library renders the real button into this div */}
         <div
            ref={buttonRef}
            id="google-signin-btn"
            className={`google-signin-btn-container ${isSigningIn ? "google-signin-btn-busy" : ""}`}
            aria-label="Sign in with Google"
            style={{
               display: isScriptLoading || scriptError ? "none" : "flex",
            }}
         />

         {/* Overlay spinner while our backend call is in flight */}
         {isSigningIn && (
            <div className="google-signin-overlay" aria-live="polite">
               <div className="spinner spinner-sm" />
               <span>Signing you in…</span>
            </div>
         )}
      </div>
   );
}
