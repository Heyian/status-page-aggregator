import type { Metadata } from "next";
import "./globals.css";
import { TelemetryProvider } from "./components/TelemetryProvider";

export const metadata: Metadata = {
  title: {
    default: "Status Page Aggregator | Real-time Service Status Monitoring",
    template: "%s | Status Page Aggregator",
  },
  description:
    "Real-time status monitoring for popular cloud, AI, and infrastructure services. Check service status and join community discussions.",
  keywords: [
    "status page",
    "service status",
    "cloud status",
    "infrastructure monitoring",
    "AI services",
    "downtime monitoring",
  ],
  authors: [{ name: "Status Page Aggregator" }],
  creator: "Status Page Aggregator",
  publisher: "Status Page Aggregator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://drdroid.io/status-page-aggregator"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drdroid.io/status-page-aggregator",
    title: "Status Page Aggregator | Real-time Service Status Monitoring",
    description:
      "Real-time status monitoring & alerting for popular cloud, AI, and infrastructure services. Check service status and find community links.",
    siteName: "Status Page Aggregator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Status Page Aggregator | Real-time Service Status Monitoring",
    description:
      "Real-time status monitoring & alerting for popular cloud, AI, and infrastructure services. Check service status and find community links.",
    creator: "@statuspageagg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize telemetry immediately before any other scripts
              (function() {
                console.log('[Telemetry] Initializing telemetry tracker...');
                
                // Event buffer - expose globally for TelemetryTracker class
                const eventBuffer = [];
                window.__telemetryBuffer = eventBuffer;
                const bufferSize = 50;
                const flushIntervalMs = 10000; // 10 seconds
                let flushTimerId;
                
                // Store original fetch
                const originalFetch = window.fetch;
                
                // Helper function to extract query parameters
                function extractQueryParams(url) {
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
                }
                
                // Helper function to extract request body
                async function extractRequestBody(init) {
                  if (!init?.body) return null;
                  
                  try {
                    if (typeof init.body === 'string') {
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
                }
                
                // Helper function to extract response body
                async function extractResponseBody(response) {
                  try {
                    const contentType = response.headers.get('content-type');
                    if (contentType?.includes('application/json')) {
                      const clone = response.clone();
                      return await clone.json();
                    } else if (contentType?.includes('text/')) {
                      const clone = response.clone();
                      return await clone.text();
                    }
                    return null;
                  } catch (error) {
                    return null;
                  }
                }
                
                // Function to flush events
                function flushEvents() {
                  if (eventBuffer.length === 0) return;
                  
                  console.log('[Telemetry] Flushing', eventBuffer.length, 'events');
                  const payload = JSON.stringify(eventBuffer);
                  
                  // Clear the buffer
                  eventBuffer.length = 0;
                  
                  // Send to telemetry endpoint using original fetch to avoid recursion
                  originalFetch('/api/telemetry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload
                  }).catch(function(err) {
                    console.error('[Telemetry] Failed to send events:', err);
                  });
                }
                
                // Start flush timer
                flushTimerId = setInterval(flushEvents, flushIntervalMs);
                
                // Patch fetch immediately
                window.fetch = function(input, init) {
                  let url = typeof input === 'string' ? input : input.url || input.href || String(input);
                  const method = init?.method || 'GET';
                  
                  // Skip tracking telemetry API calls to prevent infinite loops
                  if (url.includes('/api/telemetry')) {
                    return originalFetch.apply(this, arguments);
                  }
                  
                  const startTime = performance.now();
                  
                  console.log('[Telemetry] Fetch request started:', method, url);
                  
                  return originalFetch.apply(this, arguments).then(async function(response) {
                    const endTime = performance.now();
                    const duration = endTime - startTime;
                    
                    console.log('[Telemetry] Fetch request completed:', method, url, response.status);
                    
                    // Extract all the detailed data
                    const queryParams = extractQueryParams(url);
                    const requestHeaders = init?.headers ? Object.fromEntries(
                      init.headers instanceof Headers 
                        ? Array.from(init.headers.entries())
                        : Object.entries(init.headers)
                    ) : {};
                    const requestBody = await extractRequestBody(init);
                    const responseHeaders = Object.fromEntries(response.headers.entries());
                    const responseBody = await extractResponseBody(response);
                    
                    // Add event to buffer with complete data
                    eventBuffer.push({
                      type: 'network_complete',
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
                        endTime: endTime
                      },
                      timestamp: Date.now()
                    });
                    
                    // Flush if buffer is full
                    if (eventBuffer.length >= bufferSize) {
                      flushEvents();
                    }
                    
                    return response;
                  }).catch(async function(error) {
                    const endTime = performance.now();
                    const duration = endTime - startTime;
                    
                    console.log('[Telemetry] Fetch request failed:', method, url, error);
                    
                    // Extract request data for error events
                    const queryParams = extractQueryParams(url);
                    const requestHeaders = init?.headers ? Object.fromEntries(
                      init.headers instanceof Headers 
                        ? Array.from(init.headers.entries())
                        : Object.entries(init.headers)
                    ) : {};
                    const requestBody = await extractRequestBody(init);
                    
                    // Add error event to buffer with complete request data
                    eventBuffer.push({
                      type: 'network_error',
                      data: {
                        url: url,
                        method: method,
                        queryParams: queryParams,
                        requestHeaders: requestHeaders,
                        requestBody: requestBody,
                        error: error.message || String(error),
                        duration: duration,
                        startTime: startTime,
                        endTime: endTime
                      },
                      timestamp: Date.now()
                    });
                    
                    // Flush if buffer is full
                    if (eventBuffer.length >= bufferSize) {
                      flushEvents();
                    }
                    
                    throw error;
                  });
                };
                
                console.log('[Telemetry] Fetch patched successfully');
                
                // Clean up on page unload
                window.addEventListener('beforeunload', function() {
                  if (flushTimerId) {
                    clearInterval(flushTimerId);
                  }
                  flushEvents(); // Flush any remaining events
                });
              })();
            `,
          }}
        />
      </head>
      <body>
        {/* Initialize telemetry as early as possible */}
        <TelemetryProvider />
        {children}
      </body>
    </html>
  );
}
