"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, X, Check } from "lucide-react";

const CONSENT_KEY = "hof_cookie_consent";
const CONSENT_VERSION = "1.0";

type CookiePreferences = {
  essential: boolean; // always true, can't disable
  analytics: boolean;
  marketing: boolean;
  version: string;
};

function getStoredConsent(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null; // re-prompt if version changed
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(prefs: CookiePreferences) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
  } catch {}
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAcceptAll() {
    saveConsent({ essential: true, analytics: true, marketing: true, version: CONSENT_VERSION });
    setVisible(false);
  }

  function handleRejectAll() {
    saveConsent({ essential: true, analytics: false, marketing: false, version: CONSENT_VERSION });
    setVisible(false);
  }

  function handleSavePreferences() {
    saveConsent({ essential: true, analytics, marketing, version: CONSENT_VERSION });
    setVisible(false);
    setShowSettings(false);
  }

  function handleManageCookies() {
    const existing = getStoredConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }
    setShowSettings(true);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4"
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border-2 border-ink/15 bg-white shadow-2xl overflow-hidden">
              {/* Settings panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b-2 border-ink/10"
                  >
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg">Cookie Preferences</h3>
                        <button
                          onClick={() => setShowSettings(false)}
                          className="rounded-lg p-1 text-ink/40 hover:text-ink hover:bg-ink/5 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <p className="text-sm text-ink/60">
                        Choose which cookies you want to allow. Essential cookies are always on.
                      </p>

                      {/* Essential */}
                      <div className="flex items-center justify-between rounded-xl bg-ink/[0.03] p-4">
                        <div>
                          <p className="text-sm font-semibold">Essential Cookies</p>
                          <p className="text-xs text-ink/50 mt-0.5">Required for the site to work (cart, auth, checkout)</p>
                        </div>
                        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Always On
                        </div>
                      </div>

                      {/* Analytics */}
                      <div className="flex items-center justify-between rounded-xl border-2 border-ink/10 p-4">
                        <div className="pr-4">
                          <p className="text-sm font-semibold">Analytics Cookies</p>
                          <p className="text-xs text-ink/50 mt-0.5">Help us understand how visitors use the site</p>
                        </div>
                        <button
                          onClick={() => setAnalytics(!analytics)}
                          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                            analytics ? "bg-secondary" : "bg-ink/15"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                              analytics ? "left-[26px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Marketing */}
                      <div className="flex items-center justify-between rounded-xl border-2 border-ink/10 p-4">
                        <div className="pr-4">
                          <p className="text-sm font-semibold">Marketing Cookies</p>
                          <p className="text-xs text-ink/50 mt-0.5">Used to show relevant ads and track campaigns</p>
                        </div>
                        <button
                          onClick={() => setMarketing(!marketing)}
                          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                            marketing ? "bg-secondary" : "bg-ink/15"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                              marketing ? "left-[26px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      <button
                        onClick={handleSavePreferences}
                        className="w-full rounded-xl bg-ink py-2.5 font-semibold text-cream hover:bg-ink/85 transition-colors text-sm"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main banner */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Icon */}
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary/40 flex-shrink-0">
                    <Cookie size={24} className="text-ink" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base sm:text-lg">We Use Cookies</h3>
                    <p className="text-xs sm:text-sm text-ink/60 mt-0.5 leading-relaxed">
                      We use cookies to improve your experience, analyze traffic, and personalize content.
                      You can manage your preferences anytime.
                    </p>
                    <button
                      onClick={handleManageCookies}
                      className="text-xs font-semibold text-secondary hover:underline mt-1.5 inline-flex items-center gap-1"
                    >
                      <Settings size={12} /> Manage Preferences
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 sm:flex-none rounded-xl border-2 border-ink/15 px-4 py-2.5 text-xs font-semibold text-ink/70 hover:bg-ink/5 transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none rounded-xl bg-secondary px-5 py-2.5 text-xs font-semibold text-white hover:bg-secondary/85 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} /> Accept All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
