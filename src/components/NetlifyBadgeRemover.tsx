"use client";

import { useEffect } from "react";

export function NetlifyBadgeRemover() {
  useEffect(() => {
    const remove = () => {
      // Remove any element with Netlify branding
      document.querySelectorAll("[data-testid='netlify-badge'], a[href*='netlify.com/powered'], [title='Netlify'], .netlify-badge, #netlify-badge, #_netlify-badge").forEach((el) => el.remove());
      // Also check for any anchor with "Powered by" + Netlify text
      document.querySelectorAll("a").forEach((a) => {
        if (a.textContent?.toLowerCase().includes("netlify") || a.href?.includes("netlify.com")) {
          a.remove();
        }
      });
    };
    // Run immediately and also observe for late-injected badges
    remove();
    const observer = new MutationObserver(remove);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
