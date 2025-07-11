import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const events = await request.json();

    // Log the events for debugging
    console.log(`[Telemetry API] Received ${events.length} events:`, events);

    // Store events in Supabase for persistence and analysis
    if (events.length > 0) {
      try {
        const { error } = await supabase.from("telemetry_events").insert(
          events.map((event: any) => ({
            event_type: event.type,
            event_data: event.data,
            timestamp: new Date(event.timestamp).toISOString(),
            created_at: new Date().toISOString(),
          })),
        );

        if (error) {
          console.error(
            "[Telemetry API] Failed to store events in Supabase:",
            error,
          );
        } else {
          console.log(
            `[Telemetry API] Successfully stored ${events.length} events in Supabase`,
          );
        }
      } catch (supabaseError) {
        console.error("[Telemetry API] Supabase storage error:", supabaseError);
      }
    }

    // Log individual events for debugging
    events.forEach((event: any, index: number) => {
      console.log(`Event ${index + 1}:`, {
        type: event.type,
        timestamp: new Date(event.timestamp).toISOString(),
        data: event.data,
      });
    });

    return NextResponse.json({
      success: true,
      received: events.length,
      message: "Telemetry events received and stored successfully",
    });
  } catch (error) {
    console.error("Telemetry API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
