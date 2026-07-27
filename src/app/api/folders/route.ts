import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

// GET User Folders
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await db.folder.findMany({
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

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Fetch folders error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST Create Folder
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const folder = await db.folder.create({
      data: {
        name: name.trim(),
        userId: user.id,
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "FOLDER_CREATE",
        details: `Created folder "${folder.name}" (${folder.id})`,
      },
    }).catch(() => {});

    return NextResponse.json({
      message: "Folder created successfully",
      folder,
    }, { status: 201 });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
