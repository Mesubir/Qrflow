import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const qrCodeId = searchParams.get("qrCodeId") || undefined;
    const days = parseInt(searchParams.get("days") || "7");

    // Calculate startDate filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all analytics for QR codes belonging to this user
    const analytics = await db.scanAnalytics.findMany({
      where: {
        qrCode: {
          userId: user.id,
          id: qrCodeId,
        },
        scannedAt: {
          gte: startDate,
        },
      },
      include: {
        qrCode: true,
      },
      orderBy: {
        scannedAt: "asc",
      },
    });

    // 1. Calculate General Metrics
    const totalScans = analytics.length;
    
    // Unique Scans (Unique IPs)
    const uniqueIps = new Set(analytics.map((a) => a.ipAddress).filter(Boolean));
    const uniqueScans = uniqueIps.size;

    // Repeat visitors percentage
    const scanCountMap: Record<string, number> = {};
    analytics.forEach((a) => {
      if (a.ipAddress) {
        scanCountMap[a.ipAddress] = (scanCountMap[a.ipAddress] || 0) + 1;
      }
    });
    const repeatVisitors = Object.values(scanCountMap).filter((c) => c > 1).length;

    // 2. Aggregate Timeline Data (e.g., Daily scans)
    const timelineMap: Record<string, { date: string; scans: number; unique: number; ipSet: Set<string> }> = {};
    
    // Seed timeline days to make sure we show zeroes for empty days
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      // format date as "Jul 27" or "Mon"
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      timelineMap[dateStr] = { date: label, scans: 0, unique: 0, ipSet: new Set() };
    }

    analytics.forEach((a) => {
      const dateStr = a.scannedAt.toISOString().split("T")[0];
      if (timelineMap[dateStr]) {
        timelineMap[dateStr].scans++;
        if (a.ipAddress && !timelineMap[dateStr].ipSet.has(a.ipAddress)) {
          timelineMap[dateStr].ipSet.add(a.ipAddress);
          timelineMap[dateStr].unique++;
        }
      }
    });

    const timeline = Object.values(timelineMap).map(({ date, scans, unique }) => ({
      date,
      scans,
      unique,
    }));

    // 3. Aggregate Device Types
    const deviceMap: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0, bot: 0 };
    analytics.forEach((a) => {
      const dev = a.device.toLowerCase();
      if (dev in deviceMap) {
        deviceMap[dev]++;
      } else {
        deviceMap.desktop++; // fallback
      }
    });
    const devices = Object.entries(deviceMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // 4. Aggregate Countries
    const countryMap: Record<string, number> = {};
    analytics.forEach((a) => {
      const c = a.country || "Unknown";
      countryMap[c] = (countryMap[c] || 0) + 1;
    });
    const countries = Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 countries

    // 5. Aggregate Referrers
    const referrerMap: Record<string, number> = {};
    analytics.forEach((a) => {
      const r = a.referrer || "Direct";
      referrerMap[r] = (referrerMap[r] || 0) + 1;
    });
    const referrers = Object.entries(referrerMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 referrers

    return NextResponse.json({
      metrics: {
        totalScans,
        uniqueScans,
        repeatVisitors,
        conversionRate: totalScans > 0 ? Math.round((uniqueScans / totalScans) * 100) : 0,
      },
      timeline,
      devices,
      countries,
      referrers,
    });
  } catch (error) {
    console.error("Fetch analytics summary error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
