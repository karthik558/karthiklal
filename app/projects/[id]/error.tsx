"use client"

import ErrorFallback from "@/components/error-fallback"

export default function ProjectError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorFallback {...props} title="Project unavailable" />
}
