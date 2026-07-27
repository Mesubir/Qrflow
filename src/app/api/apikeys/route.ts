import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, generateToken } from "@/lib/auth";

// GET User API Keys
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKeys = await db.apiKey.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("Fetch API keys error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST Generate API Key
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, expiresDays } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Key name is required" }, { status: 400 });
    }

    // Generate secure token starting with 'qrf_'
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const key = `qrf_${randomHex}`;

    let expiresAt = null;
    if (expiresDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresDays));
    }

    const apiKey = await db.apiKey.create({
      data: {
        key,
        name: name.trim(),
        userId: user.id,
        expiresAt,
        status: "ACTIVE",
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "API_KEY_CREATE",
        details: `Created API key "${apiKey.name}"`,
      },
    }).catch(() => {});

    return NextResponse.json({
      message: "API Key created successfully",
      apiKey,
    }, { status: 201 });
  } catch (error) {
    console.error("Create API key error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// DELETE Revoke API Key
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json({ error: "API Key ID is required" }, { status: 400 });
    }

    // Ensure it belongs to the user
    const key = await db.apiKey.findFirst({
      where: {
        id: keyId,
        userId: user.id,
      },
    });

    if (!key) {
      return NextResponse.json({ error: "API Key not found" }, { status: 404 });
    }

    // Update status to REVOKED
    await db.apiKey.update({
      where: { id: keyId },
      data: { status: "REVOKED" },
    });

    // Log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "API_KEY_REVOKE",
        details: `Revoked API key "${key.name}"`,
      },
    }).catch(() => {});

    return NextResponse.json({
      message: "API Key revoked successfully",
    });
  } catch (error) {
    console.error("Revoke API key error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
