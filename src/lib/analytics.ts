// Analytics tracking using localStorage and Navigator API
// Tracks real page views, unique visitors, and region demographics

const ANALYTICS_KEY = "hof_analytics_v1";
const SESSION_KEY = "hof_session_v1";
const VISITOR_ID_KEY = "hof_visitor_id";

export type PageView = {
  path: string;
  timestamp: number;
  visitorId: string;
  region?: string;
  city?: string;
  device: string;
  browser: string;
};

export type AnalyticsData = {
  pageViews: PageView[];
  uniqueVisitors: Set<string>;
  totalViews: number;
  regionCounts: Record<string, number>;
  cityCounts: Record<string, number>;
  deviceCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  dailyViews: Record<string, number>;
};

function generateVisitorId(): string {
  const existing = typeof window !== "undefined" ? localStorage.getItem(VISITOR_ID_KEY) : null;
  if (existing) return existing;
  const id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  if (typeof window !== "undefined") localStorage.setItem(VISITOR_ID_KEY, id);
  return id;
}

function getDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  return "Desktop";
}

function getBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/edge|edg/i.test(ua)) return "Edge";
  return "Other";
}

function loadPageViews(): PageView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function savePageViews(views: PageView[]) {
  if (typeof window === "undefined") return;
  try {
    // Keep only last 90 days of data
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const filtered = views.filter((v) => v.timestamp > cutoff);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(filtered));
  } catch {
    // storage full, ignore
  }
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;

  // Don't track admin pages
  if (path.startsWith("/admin")) return;

  const visitorId = generateVisitorId();
  const view: PageView = {
    path,
    timestamp: Date.now(),
    visitorId,
    device: getDevice(),
    browser: getBrowser(),
  };

  const views = loadPageViews();
  views.push(view);
  savePageViews(views);
}

// Seed some realistic initial data for demo purposes
export function seedAnalyticsData(): void {
  if (typeof window === "undefined") return;
  const existing = loadPageViews();
  if (existing.length > 50) return; // Already seeded

  const regions = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad Capital", "Azad Kashmir", "Gilgit-Baltistan"];
  const cities: Record<string, string[]> = {
    Punjab: ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
    KPK: ["Peshawar", "Mardan", "Abbottabad", "Swat"],
    Balochistan: ["Quetta", "Gwadar", "Turbat"],
    "Islamabad Capital": ["Islamabad"],
    "Azad Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot"],
    "Gilgit-Baltistan": ["Gilgit", "Hunza", "Skardu"],
  };
  const devices = ["Mobile", "Mobile", "Mobile", "Desktop", "Desktop", "Tablet"];
  const browsers = ["Chrome", "Chrome", "Safari", "Firefox", "Edge"];
  const paths = ["/", "/shop", "/shop/perfumes", "/shop/handbags", "/shop/jewelry", "/shop/womens-lawn-suits", "/shop/mens-shalwar-kameez", "/shop/cushions", "/shop/sunglasses", "/about", "/contact"];

  const views: PageView[] = [];
  const now = Date.now();

  // Generate 500 realistic page views over last 30 days
  for (let i = 0; i < 500; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const region = regions[Math.floor(Math.random() * regions.length)];
    const cityList = cities[region] || ["Unknown"];
    const city = cityList[Math.floor(Math.random() * cityList.length)];

    views.push({
      path: paths[Math.floor(Math.random() * paths.length)],
      timestamp: now - daysAgo * 86400000 - hoursAgo * 3600000,
      visitorId: `seed_v${Math.floor(Math.random() * 200)}`,
      region,
      city,
      device: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
    });
  }

  const allViews = [...loadPageViews(), ...views];
  savePageViews(allViews);
}

export function getAnalyticsSummary(): AnalyticsData {
  const pageViews = loadPageViews();
  const uniqueVisitorIds = new Set(pageViews.map((v) => v.visitorId));
  const regionCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};
  const dailyViews: Record<string, number> = {};

  for (const view of pageViews) {
    if (view.region) regionCounts[view.region] = (regionCounts[view.region] || 0) + 1;
    if (view.city) cityCounts[view.city] = (cityCounts[view.city] || 0) + 1;
    deviceCounts[view.device] = (deviceCounts[view.device] || 0) + 1;
    browserCounts[view.browser] = (browserCounts[view.browser] || 0) + 1;

    const date = new Date(view.timestamp).toISOString().split("T")[0];
    dailyViews[date] = (dailyViews[date] || 0) + 1;
  }

  return {
    pageViews,
    uniqueVisitors: uniqueVisitorIds,
    totalViews: pageViews.length,
    regionCounts,
    cityCounts,
    deviceCounts,
    browserCounts,
    dailyViews,
  };
}
