import { NextResponse } from "next/server"
import { z } from "zod"
import { getClientKey, rateLimit } from "@/lib/rate-limit"

export const runtime = "edge"

const vitalSchema = z.object({
  id: z.string().max(100),
  name: z.enum(["CLS", "FCP", "FID", "INP", "LCP", "TTFB"]),
  value: z.number().finite(),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  path: z.string().max(300),
})

export async function POST(request: Request) {
  const limit = rateLimit(`vitals:${getClientKey(request)}`, 100, 60 * 1000)
  if (!limit.allowed) return new NextResponse(null, { status: 204 })

  const body = await request.json().catch(() => null)
  const parsed = vitalSchema.safeParse(body)
  if (!parsed.success) {
    return new NextResponse(null, { status: 204 })
  }

  console.info(JSON.stringify({ event: "web_vital", ...parsed.data }))
  return new NextResponse(null, { status: 204 })
}
