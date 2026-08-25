"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const { signIn, signInWithGoogle, resendVerification, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      if (result.needsVerification) setNeedsVerification(true);
    } else {
      window.location.href = "/account";
    }
  }

  async function handleResend() {
    setResending(true);
    const result = await resendVerification(email);
    setResending(false);
    if (!result.error) setResent(true);
  }

  async function handleGoogleSignIn() {
    setError("");
    const result = await signInWithGoogle();
    if (result.error) setError(result.error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef3b0] via-[#fff8e7] to-[#61ce70]/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border-2 border-ink/10 bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl">Welcome Back</h1>
            <p className="text-sm text-ink/60 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  autoFocus
                  required
                  className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-3 text-sm outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-12 py-3 text-sm outline-none focus:border-secondary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-sm text-red-500 bg-red-50 rounded-lg p-2.5"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* Email verification notice */}
            {needsVerification && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-2">
                <p className="text-sm text-blue-700 font-medium">📧 Verification email sent</p>
                <p className="text-xs text-blue-600">Check your inbox and click the verification link, then sign in.</p>
                {!resent ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-xs font-semibold text-blue-600 hover:underline disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend verification email"}
                  </button>
                ) : (
                  <p className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Verification email sent!</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-xl bg-ink py-3 font-semibold text-cream hover:bg-ink/85 transition-colors disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink/10" />
            <span className="text-xs text-ink/40">or</span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full rounded-xl border-2 border-ink/15 py-3 font-semibold text-ink/80 hover:bg-ink/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-ink/60">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-secondary hover:underline">
              Sign up
            </Link>
          </div>

          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1 text-sm text-ink/60 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} /> Back to store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
