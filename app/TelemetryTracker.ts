// lib/TelemetryTracker.ts
export type TelemetryEvent = {
  type: string;
  data: any;
  timestamp: number;
};

export type NetworkEvent = {
  url: string;
  method: string;
  queryParams?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  requestBody?: any;
  responseStatus?: number;
  responseStatusText?: string;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
  duration: number;
  error?: string;
  startTime: number;
  endTime: number;
  isSupabaseQuery?: boolean;
};

export class TelemetryTracker {
  private events: TelemetryEvent[] = [];
  private readonly bufferSize = 50;
  private readonly flushIntervalMs = 10_000;
  private flushTimerId?: ReturnType<typeof setInterval>;
  private isInitialized = false;

  private static instance: TelemetryTracker;

  private constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      this.initializeGlobalBuffer();
      this.trackPageLoad();
      this.patchClicks();
      this.patchConsole();
      this.patchXHR();
      this.patchGlobalErrors();
      this.startFlushLoop();

      this.isInitialized = true;
      console.log(
        "[Telemetry] Successfully initialized with all tracking enabled",
      );
    } catch (error) {
      console.error("[Telemetry] Failed to initialize:", error);
    }
  }

  private initializeGlobalBuffer() {
    if (typeof window === "undefined") return;

    console.log("[Telemetry] Initializing telemetry tracker...");

    // Event buffer - expose globally for TelemetryTracker class
    const eventBuffer: TelemetryEvent[] = [];
    (window as any).__telemetryBuffer = eventBuffer;
    const bufferSize = 50;
    const flushIntervalMs = 10000; // 10 seconds
    let flushTimerId: ReturnType<typeof setInterval>;

    // Function to flush events
    const flushEvents = () => {
      if (eventBuffer.length === 0) return;

      console.log("[Telemetry] Flushing", eventBuffer.length, "events");
      const payload = JSON.stringify(eventBuffer);

      // Clear the buffer
      eventBuffer.length = 0;

      // Send to telemetry endpoint using original fetch to avoid recursion
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(function (err: any) {
        console.error("[Telemetry] Failed to send events:", err);
      });
    };

    // Start flush timer
    flushTimerId = setInterval(flushEvents, flushIntervalMs);

    console.log("[Telemetry] Global buffer initialized successfully");

    // Clean up on page unload
    window.addEventListener("beforeunload", function () {
      if (flushTimerId) {
        clearInterval(flushTimerId);
      }
      flushEvents(); // Flush any remaining events
    });
  }

  public static getInstance(): TelemetryTracker {
    if (!this.instance) {
      this.instance = new TelemetryTracker();
    }
    return this.instance;
  }

  private startFlushLoop() {
    this.flushTimerId = setInterval(() => this.flush(), this.flushIntervalMs);
  }

  private capture(type: string, data: any) {
    const event = { type, data, timestamp: Date.now() };
    this.events.push(event);

    // Also add to global buffer for immediate access
    if (typeof window !== "undefined" && (window as any).__telemetryBuffer) {
      const globalBuffer = (window as any).__telemetryBuffer;
      globalBuffer.push(event);
    }

    if (this.events.length >= this.bufferSize) {
      this.flush();
    }
  }

  public flush() {
    if (this.events.length === 0) return;

    // Send events to the global telemetry buffer instead of directly to API
    if (typeof window !== "undefined" && (window as any).__telemetryBuffer) {
      const globalBuffer = (window as any).__telemetryBuffer;
      this.events.forEach((event) => globalBuffer.push(event));
      this.events = [];
    }
  }

  private trackPageLoad() {
    if (typeof window === "undefined") return;

    if (document.readyState === "complete") {
      this.capturePageLoadMetrics();
    } else {
      window.addEventListener("load", () => {
        this.capturePageLoadMetrics();
      });
    }
  }

  private capturePageLoadMetrics() {
    try {
      const t = performance.timing;
      const loadTime = t.loadEventEnd - t.navigationStart;
      const domContentLoaded = t.domContentLoadedEventEnd - t.navigationStart;
      const firstPaint = performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-paint")?.startTime;
      const firstContentfulPaint = performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-contentful-paint")?.startTime;

      this.capture("page_load", {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        },
        timing: {
          loadTime: loadTime,
          domContentLoaded: domContentLoaded,
          firstPaint: firstPaint,
          firstContentfulPaint: firstContentfulPaint,
          navigationStart: t.navigationStart,
          fetchStart: t.fetchStart,
          domainLookupStart: t.domainLookupStart,
          domainLookupEnd: t.domainLookupEnd,
          connectStart: t.connectStart,
          connectEnd: t.connectEnd,
          requestStart: t.requestStart,
          responseStart: t.responseStart,
          responseEnd: t.responseEnd,
          domLoading: t.domLoading,
          domInteractive: t.domInteractive,
          domContentLoadedEventStart: t.domContentLoadedEventStart,
          domContentLoadedEventEnd: t.domContentLoadedEventEnd,
          domComplete: t.domComplete,
          loadEventStart: t.loadEventStart,
          loadEventEnd: t.loadEventEnd,
        },
        readyState: document.readyState,
        title: document.title,
        characterSet: document.characterSet,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        platform: navigator.platform,
      });
    } catch (error) {
      console.error("Failed to capture page load metrics:", error);
    }
  }

  private patchClicks() {
    if (typeof document === "undefined") return;

    document.addEventListener(
      "click",
      (e) => {
        try {
          const tgt = e.target as HTMLElement;
          const rect = tgt.getBoundingClientRect();

          this.capture("click", {
            element: {
              tagName: tgt.tagName,
              id: tgt.id || null,
              className: tgt.className || null,
              textContent: tgt.textContent?.slice(0, 100) || null,
              href: (tgt as HTMLAnchorElement).href || null,
              type: (tgt as HTMLInputElement).type || null,
              value: (tgt as HTMLInputElement).value || null,
              placeholder: (tgt as HTMLInputElement).placeholder || null,
              role: tgt.getAttribute("role") || null,
              ariaLabel: tgt.getAttribute("aria-label") || null,
              dataAttributes: Object.fromEntries(
                Array.from(tgt.attributes)
                  .filter((attr) => attr.name.startsWith("data-"))
                  .map((attr) => [attr.name, attr.value]),
              ),
            },
            position: {
              x: e.clientX,
              y: e.clientY,
              pageX: e.pageX,
              pageY: e.pageY,
              screenX: e.screenX,
              screenY: e.screenY,
            },
            boundingRect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            },
            event: {
              button: e.button,
              buttons: e.buttons,
              ctrlKey: e.ctrlKey,
              shiftKey: e.shiftKey,
              altKey: e.altKey,
              metaKey: e.metaKey,
              type: e.type,
              timestamp: e.timeStamp,
            },
            page: {
              url: window.location.href,
              title: document.title,
              scrollX: window.scrollX,
              scrollY: window.scrollY,
            },
          });
        } catch (error) {
          console.error("Failed to capture click event:", error);
        }
      },
      true,
    );
  }

  private patchConsole() {
    if (typeof console === "undefined") return;

    (["log", "warn", "error", "info", "debug"] as const).forEach((method) => {
      const orig = console[method];
      console[method] = (...args: any[]) => {
        if (!args[0]?.toString().includes("[Telemetry]")) {
          this.capture(`console_${method}`, {
            message: args
              .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg),
              )
              .join(" "),
            args: args.map((arg) => {
              if (typeof arg === "object") {
                try {
                  return JSON.stringify(arg);
                } catch {
                  return String(arg);
                }
              }
              return String(arg);
            }),
            stack: new Error().stack?.split("\\n").slice(2, 7) || [],
            timestamp: Date.now(),
            page: {
              url: window.location.href,
              title: document.title,
            },
          });
        }
        orig.apply(console, args);
      };
    });
  }

  private patchGlobalErrors() {
    if (typeof window === "undefined") return;

    // Global error handler
    window.addEventListener("error", (event) => {
      this.capture("javascript_error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString(),
        stack: event.error?.stack,
        timestamp: Date.now(),
        page: {
          url: window.location.href,
          title: document.title,
        },
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.capture("unhandled_promise_rejection", {
        reason: event.reason?.toString(),
        promise: event.promise,
        timestamp: Date.now(),
        page: {
          url: window.location.href,
          title: document.title,
        },
      });
    });
  }

  private patchXHR() {
    if (typeof XMLHttpRequest === "undefined") return;

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest,
      method: string,
      url: string,
      async?: boolean,
      user?: string | null,
      password?: string | null,
    ) {
      (this as any)._url = url;
      (this as any)._method = method;
      (this as any)._startTime = performance.now();
      return origOpen.call(this, method, url, async ?? true, user, password);
    };

    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequest,
      body?: Document | XMLHttpRequestBodyInit | null,
    ) {
      const url = (this as any)._url;
      const method = (this as any)._method;
      const startTime = (this as any)._startTime;
      const isSupabaseQuery =
        url.includes("supabase.co") || url.includes("supabase.com");

      const onLoadEnd = async () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const status = this.status;

        try {
          const queryParams =
            TelemetryTracker.instance?.extractQueryParams(url) || {};
          const responseHeaders: Record<string, string> = {};
          const responseText = this.responseText;

          // Extract response headers
          const headerString = this.getAllResponseHeaders();
          if (headerString) {
            headerString.split("\\r\\n").forEach((line) => {
              const [key, value] = line.split(": ");
              if (key && value) {
                responseHeaders[key.toLowerCase()] = value;
              }
            });
          }

          let responseBody = null;
          try {
            if (responseText) {
              responseBody = JSON.parse(responseText);
            }
          } catch {
            responseBody = responseText;
          }

          const xhrEvent: NetworkEvent = {
            url,
            method,
            queryParams,
            responseStatus: status,
            responseStatusText: this.statusText,
            responseHeaders,
            responseBody,
            duration,
            startTime,
            endTime,
            isSupabaseQuery,
          };

          TelemetryTracker.instance?.capture(
            isSupabaseQuery ? "supabase_xhr_complete" : "xhr_complete",
            xhrEvent,
          );
        } catch (error) {
          console.error("Failed to capture XHR event:", error);
        }

        cleanup();
      };

      const onError = () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        const xhrEvent: NetworkEvent = {
          url,
          method,
          queryParams: TelemetryTracker.instance?.extractQueryParams(url) || {},
          duration,
          error: "XHR request failed",
          startTime,
          endTime,
          isSupabaseQuery,
        };

        TelemetryTracker.instance?.capture(
          isSupabaseQuery ? "supabase_xhr_error" : "xhr_error",
          xhrEvent,
        );
        cleanup();
      };

      const cleanup = () => {
        this.removeEventListener("loadend", onLoadEnd);
        this.removeEventListener("error", onError);
      };

      this.addEventListener("loadend", onLoadEnd);
      this.addEventListener("error", onError);

      return origSend.call(this, body);
    };
  }

  private extractQueryParams(url: string): Record<string, string> {
    try {
      const urlObj = new URL(url, window.location.origin);
      const params: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    } catch (error) {
      return {};
    }
  }

  public destroy() {
    if (this.flushTimerId) {
      clearInterval(this.flushTimerId);
    }
    this.flush();
  }
}
