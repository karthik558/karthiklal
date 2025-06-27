import { NextRequest, NextResponse } from 'next/server'

// Add Edge Runtime configuration for Cloudflare Pages compatibility
export const runtime = 'edge'

// Gmail API configuration
const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send'

// Function to create email in RFC 2822 format
function createEmailContent(to: string, from: string, subject: string, htmlBody: string): string {
  const boundary = '----=_NextPart_' + Math.random().toString(36).substr(2, 9)
  
  const email = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `MIME-Version: 1.0`,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    '',
    htmlBody,
    '',
    `--${boundary}--`
  ].join('\r\n')
  
  return btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Function to get access token from service account
async function getServiceAccountToken(): Promise<string> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new Error('Service account JSON not configured')
  }

  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    
    // Create JWT for service account
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/gmail.send',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
      sub: process.env.GMAIL_USER // Impersonate the Gmail user
    }

    // Note: In a real implementation, you'd need to sign this JWT with the private key
    // For Edge Runtime, we'll use a simpler approach with refresh tokens
    throw new Error('Service account implementation requires JWT signing - use refresh token approach instead')
    
  } catch (error) {
    console.error('Service account token error:', error)
    throw error
  }
}

// Function to refresh access token using refresh token
async function refreshAccessToken(): Promise<string> {
  if (!process.env.GMAIL_REFRESH_TOKEN || !process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
    throw new Error('OAuth credentials not configured for token refresh')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('Token refresh error:', errorData)
    throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

// Function to get a valid access token
async function getValidAccessToken(): Promise<string> {
  // Try refresh token approach first (more reliable for Edge Runtime)
  if (process.env.GMAIL_REFRESH_TOKEN) {
    console.log('Using refresh token to get access token...')
    return await refreshAccessToken()
  }
  
  // Fallback to provided access token
  if (process.env.GMAIL_ACCESS_TOKEN) {
    console.log('Using provided access token...')
    return process.env.GMAIL_ACCESS_TOKEN
  }
  
  // Try service account (if implemented)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.log('Attempting service account token...')
    return await getServiceAccountToken()
  }
  
  throw new Error('No valid authentication method configured')
}

// Function to send email using Gmail API with token management
async function sendEmailViaGmailAPI(to: string, from: string, subject: string, htmlContent: string) {
  const accessToken = await getValidAccessToken()
  const encodedEmail = createEmailContent(to, from, subject, htmlContent)

  const response = await fetch(GMAIL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail
    })
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('Gmail API error:', errorData)
    throw new Error(`Gmail API error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

// Alternative: send email using a service like EmailJS, Resend, or similar
async function sendEmailViaWebService(name: string, email: string, subject: string, message: string) {
  // Example with a hypothetical web service - replace with your preferred service
  // This is a fallback that could work when Gmail API is not available
  
  // For now, we'll just simulate success since the user wants to maintain Gmail setup
  console.log('Web service fallback not implemented - Gmail API required')
  throw new Error('Email service not configured. Please set up Gmail API credentials.')
}

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

    // Check for Gmail API configuration
    if (!process.env.GMAIL_USER) {
      console.error('Missing Gmail user email')
      return NextResponse.json(
        { error: 'Email service not configured. Please set GMAIL_USER.' },
        { status: 500 }
      )
    }

    // Check for at least one authentication method
    const hasRefreshToken = process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET
    const hasAccessToken = process.env.GMAIL_ACCESS_TOKEN
    const hasServiceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

    if (!hasRefreshToken && !hasAccessToken && !hasServiceAccount) {
      console.error('No Gmail authentication method configured')
      return NextResponse.json(
        { 
          error: 'Email service not configured. Please set up Gmail API credentials.',
          details: 'Need either: GMAIL_REFRESH_TOKEN + GMAIL_CLIENT_ID + GMAIL_CLIENT_SECRET, or GMAIL_ACCESS_TOKEN, or GOOGLE_SERVICE_ACCOUNT_JSON'
        },
        { status: 500 }
      )
    }

    // Extract first name for subject
    const firstName = name.split(' ')[0]
    
    // Create email HTML content
    const emailSubject = `Hey, new submission from ${firstName}`
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

    console.log('Sending email via Gmail API...')
    
    // Send email using Gmail API
    const result = await sendEmailViaGmailAPI(
      process.env.GMAIL_USER,
      process.env.GMAIL_USER,
      emailSubject,
      htmlContent
    )
    
    console.log('Email sent successfully via Gmail API:', result.id)

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
      
      if (error.message.includes('Invalid login') || error.message.includes('Username and Password not accepted')) {
        errorMessage = 'Gmail authentication failed. Please check your credentials.'
      } else if (error.message.includes('connect ETIMEDOUT') || error.message.includes('timeout')) {
        errorMessage = 'Connection timeout. Please check your internet connection.'
      } else if (error.message.includes('Gmail server not found') || error.message.includes('ENOTFOUND')) {
        errorMessage = 'Gmail server not found. Please check your network connection.'
      } else if (error.message.includes('Invalid JSON')) {
        errorMessage = 'Invalid request format'
        statusCode = 400
      } else if (error.message.includes('Gmail API error: 401')) {
        errorMessage = 'Gmail API authentication failed. Your access token may be expired. Please check your Gmail API credentials.'
      } else if (error.message.includes('Failed to refresh token')) {
        errorMessage = 'Failed to refresh access token. Please check your OAuth credentials (client ID, client secret, refresh token).'
      } else if (error.message.includes('No valid authentication method')) {
        errorMessage = 'No valid Gmail authentication configured. Please set up either refresh token or access token.'
      } else if (error.message.includes('Email service not configured')) {
        errorMessage = 'Email service not configured. Please set up Gmail API credentials.'
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
