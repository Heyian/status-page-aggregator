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

  return (
    <>
      {/* Inline script to initialize telemetry immediately */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                console.log('[Telemetry] Script execution started');
                
                // Initialize telemetry as early as possible
                if (typeof window !== 'undefined' && !window.__telemetryInitialized) {
                  window.__telemetryInitialized = true;
                  console.log('[Telemetry] Early initialization started');
                  
                  console.log('[Telemetry] About to patch fetch, window.fetch exists:', typeof window.fetch !== 'undefined');
                  
                  // Patch fetch immediately to catch early requests
                  if (typeof window.fetch !== 'undefined') {
                    console.log('[Telemetry] Patching fetch immediately');
                    const originalFetch = window.fetch;
                    
                    window.fetch = async function(input, init) {
                      let url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
                      const method = init?.method || 'GET';
                      
                      console.log('[Telemetry] Fetch intercepted:', method, url);
                      
                      // Skip tracking telemetry API calls to prevent infinite loops
                      if (url.includes('/api/telemetry') || url.includes('20.51.107.130:8000')) {
                        console.log('[Telemetry] Skipping telemetry API call:', url);
                        return originalFetch.apply(this, arguments);
                      }
                      
                      console.log('[Telemetry] Fetch request started:', method, url);
                      const startTime = performance.now();
                      const isSupabaseQuery = url.includes('supabase.co') || url.includes('supabase.com');
                      
                      try {
                        const response = await originalFetch.apply(this, arguments);
                        const endTime = performance.now();
                        const duration = endTime - startTime;
                        
                        console.log('[Telemetry] Fetch request completed:', method, url, response.status, 'duration:', duration + 'ms');
                        
                        // Send event to TelemetryTracker if available
                        if (window.__telemetryTracker) {
                          const eventType = isSupabaseQuery ? 'supabase' : 'network';
                          const eventName = isSupabaseQuery ? 'supabase_fetch_complete' : 'fetch_complete';
                          
                          window.__telemetryTracker.capture(eventType, eventName, {
                            url: url,
                            method: method,
                            responseStatus: response.status,
                            responseStatusText: response.statusText,
                            duration: duration,
                            startTime: startTime,
                            endTime: endTime,
                            isSupabaseQuery: isSupabaseQuery,
                          });
                        }
                        
                        return response;
                      } catch (error) {
                        const endTime = performance.now();
                        const duration = endTime - startTime;
                        
                        console.log('[Telemetry] Fetch request failed:', method, url, error);
                        
                        // Send error event to TelemetryTracker if available
                        if (window.__telemetryTracker) {
                          const eventType = isSupabaseQuery ? 'supabase' : 'network';
                          const eventName = isSupabaseQuery ? 'supabase_fetch_error' : 'fetch_error';
                          
                          window.__telemetryTracker.capture(eventType, eventName, {
                            url: url,
                            method: method,
                            error: error instanceof Error ? error.message : String(error),
                            duration: duration,
                            startTime: startTime,
                            endTime: endTime,
                            isSupabaseQuery: isSupabaseQuery,
                          });
                        }
                        
                        throw error;
                      }
                    };
                    
                    console.log('[Telemetry] Fetch patching completed successfully');
                  } else {
                    console.error('[Telemetry] Fetch not available for patching');
                  }
                  
                  console.log('[Telemetry] Early initialization completed with fetch patching');
                } else {
                  console.log('[Telemetry] Already initialized or window not available');
                }
              } catch (error) {
                console.error('[Telemetry] Early initialization failed:', error);
              }
            })();
          `,
        }}
      />
    </>
  );
}
