"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const { signUp, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pwChecks = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Passwords match", ok: password === confirmPw && confirmPw.length > 0 },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPw) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    const result = await signUp(email, password, fullName);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef3b0] via-[#fff8e7] to-[#61ce70]/20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="rounded-2xl border-2 border-ink/10 bg-white p-8 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h1 className="font-display text-3xl mb-2">Account Created!</h1>
            <p className="text-sm text-ink/60 mb-6">
              Welcome to House of Fashion. Your account is ready.
            </p>
            <Link
              href="/account"
              className="inline-block w-full rounded-xl bg-ink py-3 font-semibold text-cream hover:bg-ink/85 transition-colors"
            >
              Go to My Account
            </Link>
            <Link
              href="/"
              className="mt-3 flex items-center justify-center gap-1 text-sm text-ink/60 hover:text-ink transition-colors"
            >
              <ArrowLeft size={14} /> Back to store
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef3b0] via-[#fff8e7] to-[#61ce70]/20 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border-2 border-ink/10 bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl">Create Account</h1>
            <p className="text-sm text-ink/60 mt-1">Join House of Fashion</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  autoFocus
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-3 text-sm outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
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

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-3 text-sm outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Password strength indicators */}
            {password.length > 0 && (
              <div className="space-y-1">
                {pwChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${check.ok ? "bg-green-500" : "bg-ink/10"}`}>
                      {check.ok && <Check size={10} className="text-white" />}
                    </div>
                    <span className={check.ok ? "text-green-600" : "text-ink/40"}>{check.label}</span>
                  </div>
                ))}
              </div>
            )}

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
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink/60">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-secondary hover:underline">
              Sign in
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
