import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { conversionEvents, messageEvents } from "@/server/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhookType = req.headers.get("x-webhook-type");

    switch (webhookType) {
      case "conversion": {
        await db.insert(conversionEvents).values({
          accountId: body.accountId,
          goalId: body.goalId,
          flowId: body.flowId,
          subscriberId: body.subscriberId,
          eventName: body.eventName,
          revenue: body.revenue ?? 0,
          currency: body.currency ?? "USD",
          metadata: body.metadata ? JSON.stringify(body.metadata) : null,
          convertedAt: new Date(body.convertedAt ?? Date.now()),
        });
        break;
      }
      case "message_event": {
        await db.insert(messageEvents).values({
          accountId: body.accountId,
          flowId: body.flowId,
          subscriberId: body.subscriberId,
          eventType: body.eventType,
          messageId: body.messageId,
          stepName: body.stepName,
          metadata: body.metadata ? JSON.stringify(body.metadata) : null,
          occurredAt: new Date(body.occurredAt ?? Date.now()),
        });
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown webhook type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
