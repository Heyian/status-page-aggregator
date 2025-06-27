# Email API Setup

This project includes a simple email API for sending notifications via Gmail SMTP.

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Email Configuration for SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SLACK_EMAIL=recipient@example.com
```

## Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password as `EMAIL_PASS` (not your regular password)

## API Endpoints

### POST `/api/send-email`

Send an email with custom content.

**Request Body:**

```json
{
  "subject": "Your Subject",
  "message": "Your message content",
  "to": "optional-recipient@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "messageId": "<message-id>",
  "message": "Email sent successfully"
}
```

### GET `/api/send-email`

Check email configuration status.

**Response:**

```json
{
  "message": "Email API is ready",
  "configuration": {
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "***configured***",
    "pass": "***configured***",
    "recipient": "recipient@example.com"
  },
  "ready": true
}
```

## Usage Examples

### From Frontend Components

```typescript
import {
  sendEmail,
  sendStatusAlert,
  sendIncidentNotification,
} from "@/lib/email";

// Basic email
await sendEmail({
  subject: "Test Email",
  message: "This is a test message",
  to: "custom@example.com", // optional
});

// Status alert
await sendStatusAlert("GitHub", "down", "API endpoints not responding");

// Incident notification
await sendIncidentNotification("AWS", "Database connection issues", "high");
```

### Direct API Call

```bash
# Test the configuration
curl http://localhost:3000/api/send-email

# Send an email
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Email",
    "message": "Hello from your status page!"
  }'
```

## Troubleshooting

1. **Authentication Error**: Make sure you're using an App Password, not your regular Gmail password
2. **Connection Refused**: Check if Gmail SMTP is blocked by your network/firewall
3. **Invalid Recipients**: Ensure `SLACK_EMAIL` is set or provide `to` in the request body
4. **Port Issues**: Gmail SMTP uses port 587 (TLS) or 465 (SSL)

## Security Notes

- Never commit your actual email credentials to the repository
- Use environment variables for all sensitive configuration
- Consider using a dedicated email account for system notifications
- The API is designed for server-side use only (requires environment variables)
