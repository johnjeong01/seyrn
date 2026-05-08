import { NextRequest, NextResponse } from "next/server";

// Per-route limits: [maxRequests, windowMs]
const LIMITS: Record<string, [number, number]> = {
  "/api/report":        [3,  10 * 60 * 1000], // 3 per 10 min (Claude API — costly)
  "/api/waitlist/join": [5,  60 * 60 * 1000], // 5 per hour
  "/api/checkout":      [5,  60 * 60 * 1000], // 5 per hour
};

// In-memory sliding window: key = `path:ip`, value = hit timestamps
// Note: resets per edge worker instance — acceptable for low-traffic launch
const store = new Map<string, number[]>();

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = LIMITS[pathname];
  if (!rule) return NextResponse.next();

  const [limit, windowMs] = rule;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const key = `${pathname}:${ip}`;
  const now = Date.now();
  const cutoff = now - windowMs;

  const hits = (store.get(key) ?? []).filter((t) => t > cutoff);
  hits.push(now);
  store.set(key, hits);

  if (hits.length > limit) {
    const retryAfter = Math.ceil(windowMs / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/report", "/api/waitlist/join", "/api/checkout"],
};
