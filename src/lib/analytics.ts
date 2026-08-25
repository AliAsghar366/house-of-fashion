// Real analytics tracking using Supabase + IP geolocation
// Tracks actual page views from all visitors across all devices

import { supabase } from "@/lib/supabase";

const VISITOR_ID_KEY = "hof_visitor_id";
const GEO_CACHE_KEY = "hof_geo_cache";

// ─── Types ──────────────────────────────────────────────────────
export type PageView = {
  id: string;
  path: string;
  timestamp: string;
  visitor_id: string;
  region: string;
  city: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  referrer: string;
  ip_hash: string;
};

export type AnalyticsData = {
  totalViews: number;
  uniqueVisitors: number;
  regionCounts: Record<string, number>;
  cityCounts: Record<string, number>;
  deviceCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  osCounts: Record<string, number>;
  dailyViews: Record<string, number>;
  topPages: { path: string; views: number }[];
  hourlyViews: Record<string, number>;
  referrerCounts: Record<string, number>;
};

// ─── Visitor ID ─────────────────────────────────────────────────
function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return `v_${Date.now()}`;
  }
}

// ─── IP Hash (one-way, for unique visitor counting) ─────────────
async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "hof_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

// ─── Device Detection ───────────────────────────────────────────
function getDevice(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  return "Desktop";
}

function getBrowser(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/chrome|crios/i.test(ua) && !/edg|edge/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return "Safari";
  if (/edg|edge/i.test(ua)) return "Edge";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "Other";
}

function getOS(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  return "Other";
}

// ─── IP Geolocation (free API, cached) ──────────────────────────
type GeoData = { region: string; city: string; country: string };

async function getGeoFromIp(): Promise<GeoData> {
  if (typeof window === "undefined") return { region: "Unknown", city: "Unknown", country: "Unknown" };

  // Check cache first (valid for 24 hours)
  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.expiresAt > Date.now()) return parsed.data;
    }
  } catch {}

  try {
    // Use ipapi.co free tier (no API key needed, 1000 requests/day)
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("Geo API failed");
    const data = await res.json();

    const geo: GeoData = {
      region: data.region || data.region_code || "Unknown",
      city: data.city || "Unknown",
      country: data.country_name || "Unknown",
    };

    // Cache for 24 hours
    try {
      localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({
        data: geo,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      }));
    } catch {}

    return geo;
  } catch {
    // Fallback: try ip-api.com
    try {
      const res = await fetch("http://ip-api.com/json/?fields=status,country,regionName,city", {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error("Fallback geo failed");
      const data = await res.json();
      if (data.status === "success") {
        return { region: data.regionName || "Unknown", city: data.city || "Unknown", country: data.country || "Unknown" };
      }
    } catch {}
    return { region: "Unknown", city: "Unknown", country: "Pakistan" };
  }
}

// ─── Track Page View ────────────────────────────────────────────
export async function trackPageView(path: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (path.startsWith("/admin")) return;

  try {
    const visitorId = getVisitorId();
    const geo = await getGeoFromIp();

    await supabase.from("page_views").insert({
      path,
      visitor_id: visitorId,
      region: geo.region,
      city: geo.city,
      country: geo.country,
      device: getDevice(),
      browser: getBrowser(),
      os: getOS(),
      referrer: document.referrer || "direct",
    });
  } catch {
    // Silently fail — don't break the page for analytics
  }
}

// ─── Get Analytics Summary ──────────────────────────────────────
export async function getAnalyticsSummary(): Promise<AnalyticsData> {
  const empty: AnalyticsData = {
    totalViews: 0,
    uniqueVisitors: 0,
    regionCounts: {},
    cityCounts: {},
    deviceCounts: {},
    browserCounts: {},
    osCounts: {},
    dailyViews: {},
    topPages: [],
    hourlyViews: {},
    referrerCounts: {},
  };

  try {
    // Fetch last 90 days of page views
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { data: views, error } = await supabase
      .from("page_views")
      .select("*")
      .gte("timestamp", cutoff)
      .order("timestamp", { ascending: false });

    if (error || !views || views.length === 0) return empty;

    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const osCounts: Record<string, number> = {};
    const dailyViews: Record<string, number> = {};
    const hourlyViews: Record<string, number> = {};
    const pageCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};
    const uniqueVisitors = new Set<string>();

    for (const v of views) {
      if (v.region && v.region !== "Unknown") regionCounts[v.region] = (regionCounts[v.region] || 0) + 1;
      if (v.city && v.city !== "Unknown") cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
      deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
      browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
      if (v.os) osCounts[v.os] = (osCounts[v.os] || 0) + 1;

      const date = v.timestamp?.split("T")?.[0];
      if (date) dailyViews[date] = (dailyViews[date] || 0) + 1;

      const hour = v.timestamp ? new Date(v.timestamp).getHours().toString() : null;
      if (hour !== null) hourlyViews[hour] = (hourlyViews[hour] || 0) + 1;

      pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;

      if (v.referrer && v.referrer !== "direct") {
        try {
          const host = new URL(v.referrer).hostname;
          referrerCounts[host] = (referrerCounts[host] || 0) + 1;
        } catch {
          referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
        }
      }

      if (v.visitor_id) uniqueVisitors.add(v.visitor_id);
    }

    const topPages = Object.entries(pageCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return {
      totalViews: views.length,
      uniqueVisitors: uniqueVisitors.size,
      regionCounts,
      cityCounts,
      deviceCounts,
      browserCounts,
      osCounts,
      dailyViews,
      topPages,
      hourlyViews,
      referrerCounts,
    };
  } catch {
    return empty;
  }
}

// ─── Legacy compatibility ───────────────────────────────────────
// These are no-ops but keep the admin page imports working
export function seedAnalyticsData(): void {
  // No longer needed — real data is tracked automatically
}
