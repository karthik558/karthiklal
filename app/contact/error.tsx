"use client"

import ErrorFallback from "@/components/error-fallback"

export default function ContactError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorFallback {...props} title="Contact form unavailable" />
}
