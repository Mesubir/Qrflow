import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate mock invoices list based on their plan
    const invoices = [
      {
        id: "INV-2026-004",
        date: "2026-07-20",
        amount: user.subscriptionPlan === "FREE" ? "₹0" : "₹299",
        status: "PAID",
        plan: user.subscriptionPlan === "FREE" ? "FREE" : "PREMIUM",
        pdfUrl: "#",
      },
      {
        id: "INV-2026-003",
        date: "2026-06-20",
        amount: user.subscriptionPlan === "FREE" ? "₹0" : "₹299",
        status: "PAID",
        plan: user.subscriptionPlan === "FREE" ? "FREE" : "PREMIUM",
        pdfUrl: "#",
      },
      {
        id: "INV-2026-002",
        date: "2026-05-20",
        amount: "₹0",
        status: "PAID",
        plan: "FREE",
        pdfUrl: "#",
      },
    ];

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
