"use client";

import { useEffect } from "react";
import { TelemetryTracker } from "../TelemetryTracker";

export function TelemetryProvider() {
  useEffect(() => {
    // Initialize telemetry tracking as early as possible
    try {
      console.log("TelemetryProvider: Initializing telemetry tracker...");
      const tracker = TelemetryTracker.getInstance();

      // Clean up on component unmount
      return () => {
        console.log("TelemetryProvider: Cleaning up telemetry tracker...");
        tracker.destroy();
      };
    } catch (error) {
      console.error(
        "TelemetryProvider: Failed to initialize telemetry:",
        error,
      );
    }
  }, []);

  return null;
}
