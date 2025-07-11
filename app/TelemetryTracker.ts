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
};

export class TelemetryTracker {
  private events: TelemetryEvent[] = [];
  private readonly bufferSize = 50;
  private readonly flushIntervalMs = 10_000;
  private flushTimerId?: ReturnType<typeof setInterval>;
  private activeRequests = new Map<
    string,
    { startTime: number; url: string; method: string; init?: RequestInit }
  >();
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
      this.trackPageLoad();
      this.patchClicks();
      this.patchConsole();
      this.patchXHR();
      this.startFlushLoop();

      this.isInitialized = true;
    } catch (error) {
      console.error("[Telemetry] Failed to initialize:", error);
    }
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
    this.events.push({ type, data, timestamp: Date.now() });
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

  private async extractResponseBody(response: Response): Promise<any> {
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
  }

  private async extractRequestBody(init?: RequestInit): Promise<any> {
    if (!init?.body) return null;

    try {
      if (typeof init.body === "string") {
        return JSON.parse(init.body);
      } else if (init.body instanceof FormData) {
        const formData: Record<string, any> = {};
        init.body.forEach((value, key) => {
          formData[key] = value;
        });
        return formData;
      } else if (init.body instanceof URLSearchParams) {
        const params: Record<string, string> = {};
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
      this.capture("page_load", {
        url: window.location.href,
        loadTime,
        readyState: document.readyState,
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
          this.capture("click", {
            tagName: tgt.tagName,
            id: tgt.id || null,
            classes: tgt.className || null,
            x: e.clientX,
            y: e.clientY,
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

    (["log", "warn", "error", "info"] as const).forEach((method) => {
      const orig = console[method];
      console[method] = (...args: any[]) => {
        if (!args[0]?.toString().includes("[Telemetry]")) {
          this.capture(`console_${method}`, {
            args: args.map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg),
            ),
          });
        }
        orig.apply(console, args);
      };
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

      const onLoadEnd = async () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const status = this.status;

        try {
          const queryParams =
            TelemetryTracker.instance?.extractQueryParams(url) || {};
          const responseHeaders: Record<string, string> = {};
          const responseText = this.responseText;

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
          };

          TelemetryTracker.instance?.capture("xhr_complete", xhrEvent);
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
        };

        TelemetryTracker.instance?.capture("xhr_error", xhrEvent);
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

  public destroy() {
    if (this.flushTimerId) {
      clearInterval(this.flushTimerId);
    }
    this.flush();
  }
}
