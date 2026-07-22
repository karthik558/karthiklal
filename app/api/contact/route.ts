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
    
    // Create email HTML content matching website brutalist design
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEW SYSTEM INQUIRY</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #09090b; font-family: 'Courier New', Courier, monospace; color: #f4f4f5; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#09090b" style="padding: 40px 16px;">
          <tr>
            <td align="center">
              <!-- Main Card with Sharp Brutalist Borders -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#18181b" style="max-width: 620px; border: 2px solid #3f3f46; box-shadow: 8px 8px 0px #000000;">
                
                <!-- Top Accent Banner -->
                <tr>
                  <td bgcolor="#ffffff" style="padding: 12px 24px; border-bottom: 2px solid #3f3f46;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 900; color: #000000; letter-spacing: 2px; text-transform: uppercase;">
                            KARTHIK LAL // PORTFOLIO SYSTEM
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 700; color: #000000; text-transform: uppercase;">
                            [INCOMING MSG]
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Header -->
                <tr>
                  <td style="padding: 32px 32px 24px 32px; border-bottom: 2px solid #27272a;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #a1a1aa; margin-bottom: 8px;">
                      01 // NEW CONTACT FORM SUBMISSION
                    </div>
                    <h1 style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 28px; font-weight: 900; text-transform: uppercase; color: #ffffff; letter-spacing: -0.5px; line-height: 1.1;">
                      NEW INQUIRY RECEIVED
                    </h1>
                    <p style="margin: 8px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #a1a1aa; font-weight: 300;">
                      A visitor submitted a new message through the live portfolio contact form.
                    </p>
                  </td>
                </tr>

                <!-- Content Details -->
                <tr>
                  <td style="padding: 32px;">
                    
                    <!-- Sender Information Grid -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border: 1px solid #27272a; background-color: #09090b;">
                      <tr>
                        <td width="50%" valign="top" style="padding: 16px; border-right: 1px solid #27272a; border-bottom: 1px solid #27272a;">
                          <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #71717a; margin-bottom: 4px;">
                            SENDER NAME
                          </div>
                          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; color: #ffffff;">
                            ${name}
                          </div>
                        </td>
                        <td width="50%" valign="top" style="padding: 16px; border-bottom: 1px solid #27272a;">
                          <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #71717a; margin-bottom: 4px;">
                            EMAIL ADDRESS
                          </div>
                          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; color: #ffffff;">
                            <a href="mailto:${email}" style="color: #ffffff; text-decoration: underline;">${email}</a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" valign="top" style="padding: 16px;">
                          <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #71717a; margin-bottom: 4px;">
                            SUBJECT / PROJECT TYPE
                          </div>
                          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; color: #ffffff;">
                            ${subject}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Message Body -->
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #71717a; margin-bottom: 8px;">
                      MESSAGE DETAILS
                    </div>
                    <div style="background-color: #09090b; border: 2px solid #27272a; padding: 20px; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap; margin-bottom: 32px;">${message}</div>

                    <!-- Action Reply Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background-color: #ffffff; color: #000000; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 28px; border: 2px solid #ffffff; box-shadow: 4px 4px 0px #27272a;">
                            REPLY TO ${firstName.toUpperCase()} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td bgcolor="#09090b" style="padding: 20px 32px; border-top: 2px solid #27272a;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #71717a; text-transform: uppercase;">
                            SECURE TRANSMISSION // PORTFOLIO
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #71717a; text-transform: uppercase;">
                            ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Bottom Disclaimer -->
              <p style="margin: 20px 0 0 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #52525b; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                AUTOMATED TRANSMISSION // KARTHIK LAL PORTFOLIO SYSTEM
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
