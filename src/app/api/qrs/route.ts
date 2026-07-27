import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Helper to generate a unique random 6-character code
async function generateUniqueShortCode(): Promise<string> {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let shortCode = "";
  let isUnique = false;
  
  let attempts = 0;
  while (!isUnique && attempts < 10) {
    shortCode = "";
    for (let i = 0; i < 6; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check DB
    const existing = await db.qRCode.findUnique({
      where: { shortCode },
    });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  
  return shortCode;
}

// GET User QR Codes
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId") || undefined;
    const campaignId = searchParams.get("campaignId") || undefined;
    const type = searchParams.get("type") || undefined; // STATIC or DYNAMIC
    const search = searchParams.get("search") || "";

    const qrs = await db.qRCode.findMany({
      where: {
        userId: user.id,
        folderId: folderId === "null" ? null : folderId,
        campaignId: campaignId === "null" ? null : campaignId,
        type: type as any,
        name: {
          contains: search,
        },
      },
      include: {
        folder: true,
        campaign: true,
        _count: {
          select: { analytics: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ qrs });
  } catch (error) {
    console.error("Fetch QR codes error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST Create QR Code
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      type = "STATIC", // STATIC or DYNAMIC
      qrType = "WEBSITE", // WEBSITE, TEXT, WIFI, vCARD, WhatsApp, etc.
      originalUrl,
      staticData,
      folderId,
      campaignId,
      scanLimit,
      expiresAt,
      password,
      styling = {},
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Tier validation for Premium Features
    const isPremiumPlan = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"].includes(user.subscriptionPlan);
    if (type === "DYNAMIC" && !isPremiumPlan) {
      // Allow dynamic creation but restrict usage or prompt upgrade, for local simplicity, let's allow it but warn or block:
      // We will allow creation in local demo environment but enforce limit check on Starter/Free in production
    }

    // Limit check for FREE plan
    if (type === "DYNAMIC" && user.subscriptionPlan === "FREE") {
      return NextResponse.json(
        { error: "Dynamic QR Codes are a premium feature. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // Generate unique short code
    const shortCode = await generateUniqueShortCode();

    // Password hashing if provided
    let passwordHash = null;
    if (password && password.trim() !== "") {
      passwordHash = await bcrypt.hash(password, 10);
    }

    // Create QR Code record in DB
    const qrCode = await db.qRCode.create({
      data: {
        shortCode,
        name,
        type,
        qrType,
        originalUrl: type === "DYNAMIC" ? originalUrl : null,
        staticData: type === "STATIC" ? (typeof staticData === "string" ? staticData : JSON.stringify(staticData)) : null,
        status: "ACTIVE",
        folderId: folderId || null,
        campaignId: campaignId || null,
        scanLimit: scanLimit ? parseInt(scanLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        passwordHash,
        stylingJson: JSON.stringify(styling),
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "QR Code created successfully",
      qrCode,
    }, { status: 201 });
  } catch (error) {
    console.error("Create QR code error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
