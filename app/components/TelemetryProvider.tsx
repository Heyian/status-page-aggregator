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
                // Initialize telemetry as early as possible
                if (typeof window !== 'undefined' && !window.__telemetryInitialized) {
                  window.__telemetryInitialized = true;
                  
                  // Create global buffer immediately
                  window.__telemetryBuffer = window.__telemetryBuffer || [];
                  
                  // Store original fetch
                  const originalFetch = window.fetch;
                  
                  // Helper function to extract query parameters
                  const extractQueryParams = (url) => {
                    try {
                      const urlObj = new URL(url, window.location.origin);
                      const params = {};
                      urlObj.searchParams.forEach((value, key) => {
                        params[key] = value;
                      });
                      return params;
                    } catch (error) {
                      return {};
                    }
                  };
                  
                  // Helper function to extract request body
                  const extractRequestBody = async (init) => {
                    if (!init?.body) return null;
                    try {
                      if (typeof init.body === "string") {
                        return JSON.parse(init.body);
                      } else if (init.body instanceof FormData) {
                        const formData = {};
                        init.body.forEach((value, key) => {
                          formData[key] = value;
                        });
                        return formData;
                      } else if (init.body instanceof URLSearchParams) {
                        const params = {};
                        init.body.forEach((value, key) => {
                          params[key] = value;
                        });
                        return params;
                      }
                      return null;
                    } catch (error) {
                      return null;
                    }
                  };
                  
                  // Helper function to extract response body
                  const extractResponseBody = async (response) => {
                    try {
                      const contentType = response.headers.get("content-type");
                      if (contentType?.includes("application/json")) {
                        const clone = response.clone();
                        return await clone.json();
                      } else if (contentType?.includes("text/")) {
                        const clone = response.clone();
                        return await clone.text();
                      }
                      return null;
                    } catch (error) {
                      return null;
                    }
                  };
                  
                  // Function to flush events
                  const flushEvents = () => {
                    if (window.__telemetryBuffer.length === 0) return;
                    
                    console.log("[Telemetry] Flushing", window.__telemetryBuffer.length, "events");
                    const payload = JSON.stringify(window.__telemetryBuffer);
                    
                    // Clear the buffer
                    window.__telemetryBuffer.length = 0;
                    
                    // Send to telemetry endpoint using original fetch to avoid recursion
                    originalFetch("/api/telemetry", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: payload,
                    }).catch(function (err) {
                      console.error("[Telemetry] Failed to send events:", err);
                    });
                  };
                  
                  // Start flush timer
                  const flushTimerId = setInterval(flushEvents, 10000);
                  
                  // Patch fetch immediately
                  window.fetch = function (input, init) {
                    let url = typeof input === "string" ? input : (input instanceof Request ? input.url : String(input));
                    const method = init?.method || "GET";
                    
                    // Skip tracking telemetry API calls to prevent infinite loops
                    if (url.includes("/api/telemetry")) {
                      return originalFetch.apply(this, arguments);
                    }
                    
                    const startTime = performance.now();
                    const isSupabaseQuery = url.includes("supabase.co") || url.includes("supabase.com");
                    
                    console.log("[Telemetry] Fetch request started:", method, url, isSupabaseQuery ? "(Supabase)" : "");
                    
                    return originalFetch.apply(this, arguments)
                      .then(async function (response) {
                        const endTime = performance.now();
                        const duration = endTime - startTime;
                        
                        console.log("[Telemetry] Fetch request completed:", method, url, response.status, isSupabaseQuery ? "(Supabase)" : "");
                        
                        // Extract all the detailed data
                        const queryParams = extractQueryParams(url);
                        const requestHeaders = init?.headers ? Object.fromEntries(
                          init.headers instanceof Headers ? Array.from(init.headers.entries()) : Object.entries(init.headers)
                        ) : {};
                        const requestBody = await extractRequestBody(init);
                        const responseHeaders = Object.fromEntries(response.headers.entries());
                        const responseBody = await extractResponseBody(response);
                        
                        // Add event to buffer with complete data
                        window.__telemetryBuffer.push({
                          type: isSupabaseQuery ? "supabase_query_complete" : "network_complete",
                          data: {
                            url: url,
                            method: method,
                            queryParams: queryParams,
                            requestHeaders: requestHeaders,
                            requestBody: requestBody,
                            responseStatus: response.status,
                            responseStatusText: response.statusText,
                            responseHeaders: responseHeaders,
                            responseBody: responseBody,
                            duration: duration,
                            startTime: startTime,
                            endTime: endTime,
                            isSupabaseQuery: isSupabaseQuery,
                          },
                          timestamp: Date.now(),
                        });
                        
                        // Flush if buffer is full
                        if (window.__telemetryBuffer.length >= 50) {
                          flushEvents();
                        }
                        
                        return response;
                      })
                      .catch(async function (error) {
                        const endTime = performance.now();
                        const duration = endTime - startTime;
                        
                        console.log("[Telemetry] Fetch request failed:", method, url, error, isSupabaseQuery ? "(Supabase)" : "");
                        
                        // Extract request data for error events
                        const queryParams = extractQueryParams(url);
                        const requestHeaders = init?.headers ? Object.fromEntries(
                          init.headers instanceof Headers ? Array.from(init.headers.entries()) : Object.entries(init.headers)
                        ) : {};
                        const requestBody = await extractRequestBody(init);
                        
                        // Add error event to buffer with complete request data
                        window.__telemetryBuffer.push({
                          type: isSupabaseQuery ? "supabase_query_error" : "network_error",
                          data: {
                            url: url,
                            method: method,
                            queryParams: queryParams,
                            requestHeaders: requestHeaders,
                            requestBody: requestBody,
                            error: error.message || String(error),
                            duration: duration,
                            startTime: startTime,
                            endTime: endTime,
                            isSupabaseQuery: isSupabaseQuery,
                          },
                          timestamp: Date.now(),
                        });
                        
                        // Flush if buffer is full
                        if (window.__telemetryBuffer.length >= 50) {
                          flushEvents();
                        }
                        
                        throw error;
                      });
                  };
                  
                  // Track page hit immediately
                  if (!window.__pageHitTracked) {
                    window.__pageHitTracked = true;
                    window.__telemetryBuffer.push({
                      type: 'page_hit',
                      data: {
                        url: window.location.href,
                        referrer: document.referrer,
                        userAgent: navigator.userAgent,
                        viewport: {
                          width: window.innerWidth,
                          height: window.innerHeight,
                          devicePixelRatio: window.devicePixelRatio,
                        },
                        timestamp: Date.now(),
                        page: {
                          title: document.title,
                          characterSet: document.characterSet,
                          language: navigator.language,
                          cookieEnabled: navigator.cookieEnabled,
                          onLine: navigator.onLine,
                          platform: navigator.platform,
                        },
                      },
                      timestamp: Date.now(),
                    });
                  }
                  
                  // Clean up on page unload
                  window.addEventListener("beforeunload", function () {
                    if (flushTimerId) {
                      clearInterval(flushTimerId);
                    }
                    flushEvents(); // Flush any remaining events
                  });
                  
                  console.log('[Telemetry] Early initialization completed with fetch patching');
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
