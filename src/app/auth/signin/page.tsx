"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      window.location.href = "/account";
    }
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

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-xl bg-ink py-3 font-semibold text-cream hover:bg-ink/85 transition-colors disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

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
