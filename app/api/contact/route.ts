import { NextRequest, NextResponse } from 'next/server'

// Add Edge Runtime configuration for Cloudflare Pages compatibility
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  console.log('=== Contact API called ===')
  
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check for Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('Missing Resend API key')
      return NextResponse.json(
        { error: 'Email service not configured. Please set up Resend API key.' },
        { status: 500 }
      )
    }

    // Extract first name for subject
    const firstName = name.split(' ')[0]
    
    // Create email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0e121a; -webkit-font-smoothing: antialiased; line-height: 1.5; color: #f8fafc;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0e121a" style="padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Card -->
              <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#151b26" style="max-width: 600px; border-radius: 12px; border: 1px solid #1e2638; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 24px 40px; border-bottom: 1px solid #1e2638;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #f8fafc; letter-spacing: -0.5px;">New Inquiry Received</h1>
                    <p style="margin: 8px 0 0 0; font-size: 15px; color: #94a3b8;">Someone reached out via your portfolio contact form.</p>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 32px 40px;">
                    <!-- Contact Details Grid -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                      <tr>
                        <td width="50%" valign="top" style="padding-bottom: 24px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Name</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 500; color: #f8fafc;">${name}</p>
                        </td>
                        <td width="50%" valign="top" style="padding-bottom: 24px;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Email Address</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 500; color: #f8fafc;">
                            <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" valign="top">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Subject</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 500; color: #f8fafc;">${subject}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Message Block -->
                    <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Message</p>
                    <div style="background-color: #0b0f15; border: 1px solid #1e2638; border-radius: 8px; padding: 20px;">
                      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${message}</p>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                      <tr>
                        <td align="left">
                          <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background-color: #7d1e16; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; border: 1px solid #7d1e16; box-shadow: 0 4px 12px rgba(125, 30, 22, 0.3);">
                            Reply to ${firstName}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td bgcolor="#0e121a" style="padding: 24px 40px; border-top: 1px solid #1e2638;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <p style="margin: 0; font-size: 13px; color: #64748b;">Sent securely from your Portfolio</p>
                        </td>
                        <td align="right">
                          <p style="margin: 0; font-size: 13px; color: #64748b;">
                            ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Bottom Note -->
              <p style="margin: 24px 0 0 0; font-size: 12px; color: #475569; text-align: center;">
                This is an automated message. Please do not reply directly to this email address.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    console.log('Sending email via Resend...')
    
    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.TO_EMAIL || process.env.RESEND_TO_EMAIL || 'your-email@example.com',
        subject: `Hey, new submission from ${firstName}`,
        html: htmlContent,
        reply_to: email,
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Resend API error:', errorData)
      throw new Error(`Resend API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Email sent successfully via Resend:', result.id)

    return NextResponse.json(
      { 
        message: 'Email sent successfully', 
        messageId: result.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('=== Error in contact API ===')
    console.error('Error details:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email'
    let statusCode = 500
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      
      if (error.message.includes('Invalid JSON')) {
        errorMessage = 'Invalid request format'
        statusCode = 400
      } else if (error.message.includes('Resend API error: 401')) {
        errorMessage = 'Resend API authentication failed. Please check your API key.'
      } else if (error.message.includes('Resend API error: 422')) {
        errorMessage = 'Invalid email configuration. Please check your FROM_EMAIL and TO_EMAIL settings.'
      } else if (error.message.includes('Resend API error')) {
        errorMessage = 'Email service error. Please try again later.'
      } else if (error.message.includes('Email service not configured')) {
        errorMessage = 'Email service not configured. Please set up Resend API key.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: statusCode }
    )
  }
}
