type RateLimitEntry = {
  count: number
  resetAt: number
}

const entries = new Map<string, RateLimitEntry>()

export function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded
    || request.headers.get("cf-connecting-ip")
    || request.headers.get("x-real-ip")
    || "unknown"
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = entries.get(key)

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  current.count += 1
  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))

  if (entries.size > 1000) {
    for (const [entryKey, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(entryKey)
    }
  }

  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    retryAfter,
  }
}
