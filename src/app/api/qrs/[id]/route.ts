import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET Single QR Code details
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const qrCode = await db.qRCode.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        folder: true,
        campaign: true,
        redirectRules: true,
        _count: {
          select: { analytics: true },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
    }

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error("Fetch single QR error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// PUT Update QR Code
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const qrCode = await db.qRCode.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      originalUrl,
      staticData,
      status,
      folderId,
      campaignId,
      scanLimit,
      expiresAt,
      password,
      styling,
      redirectRules, // Array of rules: { type: 'COUNTRY', key: 'US', destinationUrl: '...' }
    } = body;

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (originalUrl !== undefined) updateData.originalUrl = originalUrl;
    if (staticData !== undefined) {
      updateData.staticData = typeof staticData === "string" ? staticData : JSON.stringify(staticData);
    }
    if (status !== undefined) updateData.status = status;
    
    // Explicit null/id checks
    if (folderId !== undefined) updateData.folderId = folderId === "null" || folderId === "" ? null : folderId;
    if (campaignId !== undefined) updateData.campaignId = campaignId === "null" || campaignId === "" ? null : campaignId;
    
    if (scanLimit !== undefined) updateData.scanLimit = scanLimit ? parseInt(scanLimit) : null;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    
    if (password !== undefined) {
      if (password === "" || password === null) {
        updateData.passwordHash = null;
      } else {
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }
    }
    
    if (styling !== undefined) {
      updateData.stylingJson = JSON.stringify(styling);
    }

    // Update the QR Code and redirect rules in a transaction
    const updatedQr = await db.$transaction(async (tx) => {
      // 1. Update QR Code metadata
      const qr = await tx.qRCode.update({
        where: { id },
        data: updateData,
      });

      // 2. If rules are provided, wipe existing and insert new ones
      if (redirectRules !== undefined && Array.isArray(redirectRules)) {
        await tx.qRRedirectRule.deleteMany({
          where: { qrCodeId: id },
        });

        if (redirectRules.length > 0) {
          const rulesData = redirectRules.map((rule: any) => ({
            qrCodeId: id,
            type: rule.type,
            key: rule.key,
            destinationUrl: rule.destinationUrl,
          }));

          await tx.qRRedirectRule.createMany({
            data: rulesData,
          });
        }
      }

      // Log the change in audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "QR_UPDATE",
          details: `Updated QR Code "${qr.name}" (${qr.id})`,
        },
      });

      return qr;
    });

    return NextResponse.json({
      message: "QR Code updated successfully",
      qrCode: updatedQr,
    });
  } catch (error) {
    console.error("Update QR error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// DELETE QR Code
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const qrCode = await db.qRCode.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      // Delete QR (cascade deletes redirect rules and analytics in SQLite)
      await tx.qRCode.delete({
        where: { id },
      });

      // Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "QR_DELETE",
          details: `Deleted QR Code "${qrCode.name}" (${qrCode.id})`,
        },
      });
    });

    return NextResponse.json({
      message: "QR Code deleted successfully",
    });
  } catch (error) {
    console.error("Delete QR error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
