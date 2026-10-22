import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getClientKey, rateLimit } from "@/lib/rate-limit"

export const runtime = "edge"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name cannot exceed 80 characters"),
  email: z.string().trim().email("Please provide a valid email address").max(254),
  subject: z.string().trim().min(2, "Please enter a subject").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters long").max(5000, "Message cannot exceed 5000 characters"),
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
  let lastErrorMessage = ""

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
      const errorJson = (await response.json().catch(() => ({}))) as { message?: string }
      lastErrorMessage = errorJson.message || response.statusText
      if (response.status < 500 && response.status !== 429) break
    } catch (error) {
      if (attempt === 2) throw error
    } finally {
      clearTimeout(timeout)
    }

    await wait(250 * (2 ** attempt))
  }

  throw new Error(`Email provider error (${lastStatus}): ${lastErrorMessage || "Service unavailable"}`)
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const clientKey = getClientKey(request)
  const limit = rateLimit(`contact:${clientKey}`, 15, 10 * 60 * 1000)

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
    const firstIssue = parsed.error.issues[0]
    return NextResponse.json(
      { error: firstIssue?.message || "Please check the form fields and try again." },
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

  const receivedAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date())

  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin: 0; padding: 40px 16px; background-color: #0a0908; color: #ece6de; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; margin: 0 auto; background-color: #161412; border: 2px solid #3a342e; box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.45);">
          <!-- Top Airmail Dispatch Stripe -->
          <tr>
            <td style="height: 8px; background: repeating-linear-gradient(-45deg, #ba3d2c 0px, #ba3d2c 14px, #f3efe9 14px, #f3efe9 20px, #2c4f7c 20px, #2c4f7c 34px, #f3efe9 34px, #f3efe9 40px); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Memo Header Section -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 2px solid #2a2520;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: top;">
                    <div style="display: inline-block; padding: 4px 10px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #e85a48; background-color: rgba(232, 90, 72, 0.12); border: 1.5px dashed #e85a48;">
                      COMMUNICATION DISPATCH // 09
                    </div>
                  </td>
                  <td style="text-align: right; vertical-align: top; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 700; color: #9c9284; letter-spacing: 1.5px; text-transform: uppercase;">
                    IST (UTC+5:30)
                  </td>
                </tr>
              </table>

              <h1 style="margin: 20px 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 26px; font-weight: 900; line-height: 1.2; letter-spacing: -0.5px; text-transform: uppercase; color: #ffffff;">
                NEW PORTFOLIO INQUIRY
              </h1>
              <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #ba3d2c; letter-spacing: 1px; text-transform: uppercase;">
                TRANSMISSION MEMO // REGISTERED
              </p>
            </td>
          </tr>

          <!-- Sender Dossier Specs Table -->
          <tr>
            <td style="padding: 24px 32px; background-color: #12100e;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #332d27; border-collapse: collapse;">
                <tr>
                  <td style="width: 120px; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 800; color: #a19788; text-transform: uppercase; letter-spacing: 1.5px; background-color: #1e1a17; border-bottom: 1px solid #2d2722;">
                    FROM
                  </td>
                  <td style="padding: 10px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; background-color: #181513; border-bottom: 1px solid #2d2722;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td style="width: 120px; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 800; color: #a19788; text-transform: uppercase; letter-spacing: 1.5px; background-color: #1e1a17; border-bottom: 1px solid #2d2722;">
                    EMAIL
                  </td>
                  <td style="padding: 10px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; background-color: #181513; border-bottom: 1px solid #2d2722;">
                    <a href="mailto:${safeEmail}" style="color: #e85a48; text-decoration: none; border-bottom: 1px dotted #e85a48;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="width: 120px; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 800; color: #a19788; text-transform: uppercase; letter-spacing: 1.5px; background-color: #1e1a17; border-bottom: 1px solid #2d2722;">
                    SUBJECT
                  </td>
                  <td style="padding: 10px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; background-color: #181513; border-bottom: 1px solid #2d2722;">
                    <span style="display: inline-block; padding: 2px 8px; background-color: #26211c; border: 1px solid #4a4036; color: #f0eae1; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${safeSubject}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="width: 120px; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 800; color: #a19788; text-transform: uppercase; letter-spacing: 1.5px; background-color: #1e1a17;">
                    RECEIVED
                  </td>
                  <td style="padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 600; color: #c4bbb0; background-color: #181513;">
                    ${receivedAt} // IST
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Content Box -->
          <tr>
            <td style="padding: 12px 32px 32px 32px; background-color: #161412;">
              <div style="margin-bottom: 8px; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #a19788;">
                // MESSAGE DISPATCH BODY
              </div>
              <div style="padding: 22px; background-color: #0c0b0a; border: 1.5px solid #38312b; color: #eae4dc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.7; white-space: pre-wrap; word-break: break-word;">${safeMessage}</div>
            </td>
          </tr>

          <!-- Action Button Area -->
          <tr>
            <td style="padding: 0 32px 32px 32px; background-color: #161412;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                  <td style="text-align: left;">
                    <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject)}" style="display: inline-block; padding: 14px 28px; background-color: #ba3d2c; color: #ffffff; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border: 2px solid #ba3d2c; box-shadow: 3px 3px 0px #000000;">
                      REPLY TO SENDER &rarr;
                    </a>
                    &nbsp;&nbsp;
                    <a href="https://karthiklal.in" style="display: inline-block; padding: 14px 20px; background-color: #1e1a17; color: #eae4dc; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border: 1.5px solid #38312b;">
                      VIEW PORTFOLIO
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0d0c0a; border-top: 2px solid #2a2520; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #f0eae1;">
                KARTHIK LAL // PORTFOLIO DISPATCH
              </p>
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #7d7366; letter-spacing: 1px; text-transform: uppercase;">
                KERALA, INDIA &bull; IST (UTC+5:30) &bull; DEV@KARTHIKLAL.IN
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #5e564c; line-height: 1.5;">
                This email was generated from the contact memo dispatch form on <a href="https://karthiklal.in" style="color: #9c9284; text-decoration: underline;">karthiklal.in</a>. All responses will be delivered directly to the sender.
              </p>
            </td>
          </tr>

          <!-- Bottom Airmail Dispatch Stripe -->
          <tr>
            <td style="height: 8px; background: repeating-linear-gradient(-45deg, #ba3d2c 0px, #ba3d2c 14px, #f3efe9 14px, #f3efe9 20px, #2c4f7c 20px, #2c4f7c 34px, #f3efe9 34px, #f3efe9 40px); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
        </table>
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
      error: error instanceof Error ? error.message : "UnknownError",
    }))
    return NextResponse.json(
      { error: "The message could not be sent right now. Please try again later." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    )
  }
}
