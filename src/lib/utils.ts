// Simple regex User-Agent parser (optimized for edge running, 0 dependencies)
export function parseUserAgent(uaString: string | null) {
  const ua = uaString || "";
  
  let device = "desktop";
  let os = "Unknown";
  let browser = "Unknown";

  // 1. Device Type
  if (/ipad|tablet/i.test(ua)) {
    device = "tablet";
  } else if (/mobile|iphone|android|phone/i.test(ua)) {
    device = "mobile";
  }

  // 2. OS Categorization
  if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/windows/i.test(ua)) {
    os = "Windows";
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // 3. Browser Categorization
  if (/edg/i.test(ua)) {
    browser = "Edge";
  } else if (/chrome|crios/i.test(ua)) {
    browser = "Chrome";
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox";
  }

  return { device, os, browser };
}

// Hash client IP securely using SHA-256 for GDPR compliance
export async function hashIP(ip: string | null): Promise<string> {
  const cleanIp = ip || "127.0.0.1";
  const msgUint8 = new TextEncoder().encode(cleanIp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
