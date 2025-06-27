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
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8fafc; line-height: 1.6; color: #374151;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
          
          <!-- Header -->
          <div style="background: #7d1e16; padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
              New Portfolio Contact
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">
              You have received a new message
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            
            <!-- Contact Information -->
            <div style="margin-bottom: 32px;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #7d1e16; padding-bottom: 8px;">
                Contact Details
              </h2>
              
              <div style="background: #f9fafb; border-radius: 8px; padding: 24px; border-left: 4px solid #7d1e16;">
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Name</p>
                  <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${name}</p>
                </div>
                
                <div style="margin-bottom: 16px;">
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Email</p>
                  <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${email}</p>
                </div>
                
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Subject</p>
                  <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${subject}</p>
                </div>
              </div>
            </div>

            <!-- Message Content -->
            <div style="margin-bottom: 32px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #7d1e16; padding-bottom: 8px;">
                Message
              </h2>
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                <div style="font-size: 16px; line-height: 1.7; color: #374151; white-space: pre-wrap;">
${message}
                </div>
              </div>
            </div>

            <!-- Reply Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: #7d1e16; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.2s;">
                Reply to ${firstName}
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">
              Sent from your portfolio contact form
            </p>
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>

        </div>
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
