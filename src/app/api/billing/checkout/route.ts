import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    const validPlans = ["FREE", "STARTER", "PRO", "BUSINESS"];
    if (!plan || !validPlans.includes(plan.toUpperCase())) {
      return NextResponse.json({ error: "Invalid subscription plan selected" }, { status: 400 });
    }

    const uppercasePlan = plan.toUpperCase();

    // Update user plan directly in the DB to mock checkout success
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: uppercasePlan,
        subscriptionStatus: "ACTIVE",
        stripeSubId: `sub_mock_${Math.random().toString(36).substr(2, 9)}`,
        stripeCustomerId: `cus_mock_${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "BILLING_UPGRADE",
        details: `Upgraded subscription tier to ${uppercasePlan}`,
      },
    }).catch(() => {});

    // Create mock notification
    await db.notification.create({
      data: {
        userId: user.id,
        title: "Subscription Activated",
        message: `Congratulations! Your subscription to the ${uppercasePlan} plan is now active. Enjoy premium features!`,
        type: "SUCCESS",
      },
    }).catch(() => {});

    return NextResponse.json({
      message: "Subscription successfully updated",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionPlan: updatedUser.subscriptionPlan,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("Billing checkout mock error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
