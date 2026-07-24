"use client"

import ErrorFallback from "@/components/error-fallback"

export default function BlogError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorFallback {...props} title="Article unavailable" />
}
