"use client"

import { useEffect } from "react"
import { useReportWebVitals } from "next/web-vitals"

const supportedWebVitals = new Set(["CLS", "FCP", "FID", "INP", "LCP", "TTFB"])

const report = (endpoint: string, body: Record<string, unknown>) => {
  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined)
}

export function Analytics() {
  useReportWebVitals((metric) => {
    if (!supportedWebVitals.has(metric.name) || !Number.isFinite(metric.value)) {
      return
    }

    report("/api/monitoring/vitals", {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating ?? "needs-improvement",
      path: window.location.pathname,
    })
  })

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      report("/api/monitoring/errors", {
        type: "error",
        name: event.error?.name || "Error",
        message: event.message || "Unknown client error",
        path: window.location.pathname,
      })
    }
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      report("/api/monitoring/errors", {
        type: "unhandledrejection",
        name: reason instanceof Error ? reason.name : "UnhandledRejection",
        message: reason instanceof Error ? reason.message : "Unhandled promise rejection",
        path: window.location.pathname,
      })
    }

    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onRejection)
    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onRejection)
    }
  }, [])

  return null
}
