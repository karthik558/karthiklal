import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getClientKey, rateLimit } from "@/lib/rate-limit"

export const runtime = "edge"

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional().default(""),
})

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]!)

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function sendWithRetry(payload: Record<string, unknown>) {
  let lastStatus = 503

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8_000)

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (response.ok) return response.json()

      lastStatus = response.status
      if (response.status < 500 && response.status !== 429) break
    } catch (error) {
      if (attempt === 2) throw error
    } finally {
      clearTimeout(timeout)
    }

    await wait(250 * (2 ** attempt))
  }

  throw new Error(`Email provider unavailable (${lastStatus})`)
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const clientKey = getClientKey(request)
  const limit = rateLimit(`contact:${clientKey}`, 5, 10 * 60 * 1000)

  if (!limit.allowed) {
    console.warn(JSON.stringify({ event: "contact_rate_limited", requestId }))
    return NextResponse.json(
      { error: "Too many messages. Please wait a few minutes and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter), "Cache-Control": "no-store" },
      },
    )
  }

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request format." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  const parsed = contactSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  if (parsed.data.website) {
    console.info(JSON.stringify({ event: "contact_bot_filtered", requestId }))
    return NextResponse.json({ message: "Message received." })
  }

  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !(process.env.TO_EMAIL || process.env.RESEND_TO_EMAIL)) {
    console.error(JSON.stringify({ event: "contact_configuration_error", requestId }))
    return NextResponse.json(
      { error: "Messaging is temporarily unavailable. Please email us directly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    )
  }

  const { name, email, subject, message } = parsed.data
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message)

  const html = `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;padding:32px;background:#09090b;color:#f4f4f5;font-family:Arial,sans-serif">
        <main style="max-width:620px;margin:auto;padding:32px;background:#18181b;border:2px solid #3f3f46">
          <p style="font:700 11px monospace;letter-spacing:2px;color:#a1a1aa">NEW PORTFOLIO INQUIRY</p>
          <h1 style="font-size:28px">New inquiry from ${safeName}</h1>
          <p><strong>Email:</strong> <a style="color:#fff" href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <div style="white-space:pre-wrap;padding:20px;background:#09090b;border:1px solid #3f3f46">${safeMessage}</div>
        </main>
      </body>
    </html>
  `

  try {
    const result = await sendWithRetry({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL || process.env.RESEND_TO_EMAIL,
      subject: `Portfolio inquiry: ${subject}`,
      html,
      reply_to: email,
    })

    console.info(JSON.stringify({
      event: "contact_sent",
      requestId,
      messageId: typeof result?.id === "string" ? result.id : undefined,
    }))
    return NextResponse.json({ message: "Message sent successfully." })
  } catch (error) {
    console.error(JSON.stringify({
      event: "contact_provider_error",
      requestId,
      error: error instanceof Error ? error.name : "UnknownError",
    }))
    return NextResponse.json(
      { error: "The message could not be sent right now. Please try again later." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    )
  }
}
