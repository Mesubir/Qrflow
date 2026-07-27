import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// GET User Campaigns
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaigns = await db.campaign.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { qrs: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Fetch campaigns error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST Create Campaign
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
    }

    const campaign = await db.campaign.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        userId: user.id,
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CAMPAIGN_CREATE",
        details: `Created campaign "${campaign.name}" (${campaign.id})`,
      },
    }).catch(() => {});

    return NextResponse.json({
      message: "Campaign created successfully",
      campaign,
    }, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
