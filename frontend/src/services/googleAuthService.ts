const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

// GIS is the Google Identity Services library that handles the OAuth flow
const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GIS_SCRIPT_ID = "google-gsi-script";

export interface CredentialResponse {
   /** Google-signed JWT (the idToken) to POST to our backend */
   credential: string;
   select_by: string;
}

interface IdConfiguration {
   client_id: string;
   callback: (response: CredentialResponse) => void;
   auto_select?: boolean;
   cancel_on_tap_outside?: boolean;
   nonce?: string;
   context?: "signin" | "signup" | "use";
   ux_mode?: "popup" | "redirect";
}

interface GsiButtonConfiguration {
   type?: "standard" | "icon";
   theme?: "outline" | "filled_blue" | "filled_black";
   size?: "large" | "medium" | "small";
   text?: "signin_with" | "signup_with" | "continue_with" | "signin";
   shape?: "rectangular" | "pill" | "circle" | "square";
   logo_alignment?: "left" | "center";
   width?: number;
   locale?: string;
}

interface GoogleAccounts {
   id: {
      initialize: (config: IdConfiguration) => void;
      renderButton: (
         container: HTMLElement,
         config: GsiButtonConfiguration,
      ) => void;
      prompt: () => void;
      cancel: () => void;
      disableAutoSelect: () => void;
   };
}

declare global {
   interface Window {
      google?: { accounts: GoogleAccounts };
      googleGsiLoaded?: boolean;
   }
}

let _loadPromise: Promise<void> | null = null;

export function loadGoogleScript(): Promise<void> {
   // If the script is already loaded, return it
   if (window.googleGsiLoaded && window.google?.accounts) {
      return Promise.resolve();
   }

   // If script is already loading, return it
   if (_loadPromise) return _loadPromise;

   // If script is not loaded, create a new promise to load it
   _loadPromise = new Promise<void>((resolve, reject) => {
      // If the script tag already exists (e.g. HMR), just wait for window.google
      const existing = document.getElementById(GIS_SCRIPT_ID);

      if (existing) {
         const poll = setInterval(() => {
            if (window.google?.accounts) {
               clearInterval(poll);
               window.googleGsiLoaded = true;
               resolve();
            }
         }, 50);
         return;
      }

      // Create the script tag and append it to the head
      const script = document.createElement("script");
      script.id = GIS_SCRIPT_ID;
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.defer = true;

      script.onload = () => {
         window.googleGsiLoaded = true;
         resolve();
      };

      script.onerror = () => {
         _loadPromise = null; // allow retry
         reject(
            new Error("Failed to load the Google Identity Services script."),
         );
      };

      document.head.appendChild(script);
   });

   return _loadPromise;
}

// Initialize the Google Sign In
export function initializeGoogleSignIn(
   callback: (response: CredentialResponse) => void,
): void {
   if (!window.google?.accounts) {
      throw new Error(
         "GIS library is not loaded. Call loadGoogleScript() first.",
      );
   }

   if (!GOOGLE_CLIENT_ID) {
      throw new Error(
         "VITE_GOOGLE_CLIENT_ID is not set in environment variables.",
      );
   }

   window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback,
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: "popup",
      context: "signin",
   });
}

// Render the Google button
export function renderGoogleButton(
   container: HTMLElement,
   options?: GsiButtonConfiguration,
): void {
   if (!window.google?.accounts) {
      throw new Error("GIS library is not loaded.");
   }

   window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      shape: "pill",
      logo_alignment: "left",
      width: container.offsetWidth || undefined,
      ...options,
   });
}

/**
 * Cleanly cancel any ongoing GIS prompt / One-Tap session.
 * Call this in component cleanup (useEffect return).
 */
export function cancelGoogleSignIn(): void {
   window.google?.accounts.id.cancel();
}
