import { NextRequest } from "next/server";

export interface ScanMetadata {
  ipAddress: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  device: "desktop" | "mobile" | "tablet" | "bot";
  browser: string;
  os: string;
  language: string;
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

// Simple parser for user agent strings
export function parseUserAgent(uaString: string | null): {
  device: "desktop" | "mobile" | "tablet" | "bot";
  browser: string;
  os: string;
  isBot: boolean;
} {
  if (!uaString) {
    return { device: "desktop", browser: "Unknown", os: "Unknown", isBot: false };
  }

  const ua = uaString.toLowerCase();
  
  // 1. Detect Bots
  const botKeywords = [
    "bot", "crawler", "spider", "googlebot", "bingbot", "yandex", "baiduspider",
    "facebookexternalhit", "twitterbot", "rogerbot", "linkedinbot", "embedly", 
    "quora link preview", "showyoubot", "outbrain", "pinterest/0.", "slackbot", 
    "vkshare", "w3c_validator"
  ];
  
  const isBot = botKeywords.some(keyword => ua.includes(keyword));
  if (isBot) {
    return { device: "bot", browser: "Search Bot", os: "Server", isBot: true };
  }

  // 2. Detect OS
  let os = "Unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh") || ua.includes("mac os x")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) os = "iOS";
  else if (ua.includes("linux")) os = "Linux";

  // 3. Detect Device
  let device: "desktop" | "mobile" | "tablet" = "desktop";
  if (ua.includes("ipad") || (ua.includes("android") && !ua.includes("mobile"))) {
    device = "tablet";
  } else if (ua.includes("iphone") || ua.includes("ipod") || ua.includes("mobile")) {
    device = "mobile";
  }

  // 4. Detect Browser
  let browser = "Unknown";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome/") || ua.includes("crios/")) browser = "Chrome";
  else if (ua.includes("safari/") && ua.includes("version/")) browser = "Safari";
  else if (ua.includes("firefox/") || ua.includes("fxios/")) browser = "Firefox";
  else if (ua.includes("opr/") || ua.includes("opera/")) browser = "Opera";
  else if (ua.includes("msie") || ua.includes("trident/")) browser = "Internet Explorer";

  return { device, browser, os, isBot: false };
}

// Sample list of mock locations for rich simulation in development
const mockLocations = [
  { country: "US", region: "California", city: "San Francisco", timezone: "America/Los_Angeles" },
  { country: "US", region: "New York", city: "New York", timezone: "America/New_York" },
  { country: "GB", region: "England", city: "London", timezone: "Europe/London" },
  { country: "DE", region: "Berlin", city: "Berlin", timezone: "Europe/Berlin" },
  { country: "IN", region: "Karnataka", city: "Bengaluru", timezone: "Asia/Kolkata" },
  { country: "IN", region: "Maharashtra", city: "Mumbai", timezone: "Asia/Kolkata" },
  { country: "SG", region: "Central", city: "Singapore", timezone: "Asia/Singapore" },
  { country: "JP", region: "Tokyo", city: "Tokyo", timezone: "Asia/Tokyo" },
  { country: "FR", region: "Île-de-France", city: "Paris", timezone: "Europe/Paris" },
  { country: "AU", region: "New South Wales", city: "Sydney", timezone: "Australia/Sydney" }
];

export function getScanMetadata(req: NextRequest): ScanMetadata {
  const headers = req.headers;
  
  // Extract IP
  const forwardedFor = headers.get("x-forwarded-for");
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  
  // Parse User Agent
  const userAgent = headers.get("user-agent");
  const { device, browser, os, isBot } = parseUserAgent(userAgent);
  
  // Parse Accept-Language
  const acceptLanguage = headers.get("accept-language") || "en";
  const language = acceptLanguage.split(",")[0].split(";")[0].split("-")[0].trim().toUpperCase() || "EN";
  
  // Parse Referrer
  const refererHeader = headers.get("referer") || "Direct";
  let referrer = "Direct";
  try {
    if (refererHeader !== "Direct") {
      const url = new URL(refererHeader);
      referrer = url.hostname.replace("www.", "");
    }
  } catch {
    referrer = refererHeader;
  }
  
  // Extract UTM Parameters from Request URL
  const searchParams = req.nextUrl.searchParams;
  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");
  const utmCampaign = searchParams.get("utm_campaign");
  const utmContent = searchParams.get("utm_content");
  const utmTerm = searchParams.get("utm_term");
  
  // Extract Geo Info from Headers (standard CDN/Vercel header names)
  let country = headers.get("x-vercel-ip-country") || "Unknown";
  let region = headers.get("x-vercel-ip-country-region") || "Unknown";
  let city = headers.get("x-vercel-ip-country-city") || "Unknown";
  let timezone = headers.get("x-vercel-ip-timezone") || "UTC";
  
  // Mock Location logic for Localhost testing/simulating analytics
  const isLocal = ipAddress === "127.0.0.1" || ipAddress === "::1" || ipAddress.startsWith("192.168.");
  if (isLocal && (country === "Unknown" || country === "US" && city === "Unknown")) {
    // Choose a random location from our rich lists to make local charts pop
    const mock = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    country = mock.country;
    region = mock.region;
    city = mock.city;
    timezone = mock.timezone;
  }

  return {
    ipAddress,
    country,
    region,
    city,
    timezone,
    device: isBot ? "bot" : device,
    browser,
    os,
    language,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm
  };
}
