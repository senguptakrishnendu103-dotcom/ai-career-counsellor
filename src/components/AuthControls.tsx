import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";

/**
 * AuthControls renders the login / signup button, logout button, and the modal.
 * It lives inside the AuthProvider so it has access to the authentication state.
 */
export const AuthControls: React.FC = () => {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />

      {/* Top‑right auth button */}
      <div className="absolute top-4 right-4 z-20">
        {user ? (
          <button
            onClick={signOut}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500"
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={() => {
              setAuthMode("login");
              setAuthOpen(true);
            }}
            className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-500"
          >
            Log In / Sign Up
          </button>
        )}
      </div>
    </>
  );
};
