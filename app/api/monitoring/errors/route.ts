import { NextResponse } from "next/server"
import { z } from "zod"
import { getClientKey, rateLimit } from "@/lib/rate-limit"

export const runtime = "edge"

const errorSchema = z.object({
  type: z.enum(["error", "unhandledrejection"]),
  name: z.string().max(100),
  message: z.string().max(500),
  path: z.string().max(300),
})

export async function POST(request: Request) {
  const limit = rateLimit(`errors:${getClientKey(request)}`, 20, 60 * 1000)
  if (!limit.allowed) return new NextResponse(null, { status: 204 })

  const body = await request.json().catch(() => null)
  const parsed = errorSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid error report." }, { status: 400 })

  console.error(JSON.stringify({ event: "client_error", ...parsed.data }))
  return new NextResponse(null, { status: 204 })
}
