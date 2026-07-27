import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getScanMetadata } from "@/lib/geo";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ shortCode: string }> }
) {
  const params = await props.params;
  const { shortCode } = params;

  try {
    // 1. Fetch QR Code with details
    const qrCode = await db.qRCode.findUnique({
      where: { shortCode },
      include: {
        redirectRules: true,
        _count: {
          select: { analytics: true },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    // 2. Validate QR Code Status
    if (qrCode.status === "PAUSED") {
      return NextResponse.redirect(
        new URL(`/status?type=paused&name=${encodeURIComponent(qrCode.name)}`, request.url)
      );
    }
    if (qrCode.status === "ARCHIVED") {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    // 3. Check Expiry
    if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
      if (qrCode.status !== "EXPIRED") {
        await db.qRCode.update({
          where: { id: qrCode.id },
          data: { status: "EXPIRED" },
        });
      }
      return NextResponse.redirect(
        new URL(`/status?type=expired&name=${encodeURIComponent(qrCode.name)}`, request.url)
      );
    }

    // 4. Check Scan Limit
    const scanCount = qrCode._count.analytics;
    if (qrCode.scanLimit && scanCount >= qrCode.scanLimit) {
      if (qrCode.status !== "EXPIRED") {
        await db.qRCode.update({
          where: { id: qrCode.id },
          data: { status: "EXPIRED" },
        });
      }
      return NextResponse.redirect(
        new URL(`/status?type=limit&name=${encodeURIComponent(qrCode.name)}`, request.url)
      );
    }

    // 5. Check Password Protection
    if (qrCode.passwordHash) {
      const searchParams = request.nextUrl.searchParams;
      const pwdParam = searchParams.get("pwd");
      
      let authenticated = false;
      if (pwdParam) {
        authenticated = await bcrypt.compare(pwdParam, qrCode.passwordHash).catch(() => false);
      }

      if (!authenticated) {
        // Redirect to a password entry page
        return NextResponse.redirect(
          new URL(`/r/${shortCode}/password?next=${encodeURIComponent(request.nextUrl.search)}`, request.url)
        );
      }
    }

    // 6. Gather Client Meta & Location Details
    const meta = getScanMetadata(request);

    // 7. Resolve Redirection URL based on Advanced Rules
    let targetUrl = qrCode.originalUrl || "/";

    if (qrCode.redirectRules && qrCode.redirectRules.length > 0) {
      // Rule 1: A/B Testing Weighting
      const abRules = qrCode.redirectRules.filter((r) => r.type === "AB_TEST");
      if (abRules.length > 0) {
        // Roll a dice from 0 to 100
        const dice = Math.random() * 100;
        let cumulativeWeight = 0;
        for (const rule of abRules) {
          const weight = parseFloat(rule.key) || 0;
          cumulativeWeight += weight;
          if (dice <= cumulativeWeight) {
            targetUrl = rule.destinationUrl;
            break;
          }
        }
      } else {
        // Rule 2: Device matching (iOS, Android, mobile, desktop, tablet)
        const deviceRule = qrCode.redirectRules.find(
          (r) => r.type === "DEVICE" && r.key.toLowerCase() === meta.device.toLowerCase()
        );
        if (deviceRule) {
          targetUrl = deviceRule.destinationUrl;
        } else {
          // Rule 3: Country matching (e.g. US, DE, IN, GB)
          const countryRule = qrCode.redirectRules.find(
            (r) => r.type === "COUNTRY" && r.key.toUpperCase() === meta.country.toUpperCase()
          );
          if (countryRule) {
            targetUrl = countryRule.destinationUrl;
          } else {
            // Rule 4: Language matching (e.g. EN, ES, DE)
            const langRule = qrCode.redirectRules.find(
              (r) => r.type === "LANGUAGE" && r.key.toUpperCase() === meta.language.toUpperCase()
            );
            if (langRule) {
              targetUrl = langRule.destinationUrl;
            }
          }
        }
      }
    }

    // 8. Log Analytics in background
    db.scanAnalytics
      .create({
        data: {
          qrCodeId: qrCode.id,
          ipAddress: meta.ipAddress,
          country: meta.country,
          region: meta.region,
          city: meta.city,
          timezone: meta.timezone,
          device: meta.device,
          browser: meta.browser,
          os: meta.os,
          language: meta.language,
          referrer: meta.referrer,
          utmSource: meta.utmSource,
          utmMedium: meta.utmMedium,
          utmCampaign: meta.utmCampaign,
          utmContent: meta.utmContent,
          utmTerm: meta.utmTerm,
          isBot: meta.device === "bot",
        },
      })
      .catch((err) => console.error("Failed to log scan analytics:", err));

    // 9. Perform Redirection (307 Temporary Redirect to ensure subsequent visits are logged)
    return NextResponse.redirect(targetUrl, 307);
  } catch (error) {
    console.error("Redirect Error:", error);
    return NextResponse.redirect(new URL("/500", request.url));
  }
}
