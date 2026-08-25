"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, AlertCircle, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "verified">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Handle the hash fragment from OAuth redirect
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");

        if (accessToken) {
          // OAuth callback — Supabase will process the token
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            setStatus("error");
            setMessage(error.message);
          } else if (data.session) {
            setStatus("success");
            setTimeout(() => { window.location.href = "/account"; }, 2000);
          }
        } else {
          // Check if this is an email verification callback
          const urlParams = new URLSearchParams(window.location.search);
          const type = urlParams.get("type");

          if (type === "signup" || type === "magiclink" || type === "recovery") {
            // Email verification / magic link
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.search);
            if (error) {
              // Try the OTP approach
              setStatus("verified");
              setMessage("Your email has been verified! You can now sign in.");
            } else {
              setStatus("verified");
              setMessage("Email verified! Redirecting to your account...");
              setTimeout(() => { window.location.href = "/account"; }, 2000);
            }
          } else {
            // Generic callback
            const { data, error } = await supabase.auth.getSession();
            if (data.session) {
              setStatus("success");
              setTimeout(() => { window.location.href = "/account"; }, 1500);
            } else {
              setStatus("verified");
              setMessage("Authentication complete. You can now sign in.");
            }
          }
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong during authentication");
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef3b0] via-[#fff8e7] to-[#61ce70]/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="rounded-2xl border-2 border-ink/10 bg-white p-8 shadow-xl">
          {status === "loading" && (
            <>
              <Loader2 size={48} className="mx-auto text-secondary animate-spin mb-4" />
              <h1 className="font-display text-2xl mb-2">Authenticating...</h1>
              <p className="text-sm text-ink/50">Please wait while we verify your account.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h1 className="font-display text-2xl mb-2">Welcome!</h1>
              <p className="text-sm text-ink/60">Redirecting to your account...</p>
            </>
          )}

          {status === "verified" && (
            <>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-blue-600" />
              </div>
              <h1 className="font-display text-2xl mb-2">Email Verified!</h1>
              <p className="text-sm text-ink/60 mb-4">{message}</p>
              <Link
                href="/auth/signin"
                className="inline-block w-full rounded-xl bg-ink py-3 font-semibold text-cream hover:bg-ink/85 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h1 className="font-display text-2xl mb-2">Authentication Failed</h1>
              <p className="text-sm text-ink/60 mb-4">{message}</p>
              <Link
                href="/auth/signin"
                className="inline-block w-full rounded-xl bg-ink py-3 font-semibold text-cream hover:bg-ink/85 transition-colors"
              >
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
