# Email API Documentation

This document describes the email API endpoints available in the Driver Qualification Tool.

## Base URL

All email API endpoints are prefixed with `/api/v1/emails/`

## Authentication

Currently, these endpoints do not require authentication, but this should be added in production.

## Endpoints

### 1. Send Template Email

**POST** `/api/v1/emails/send-template`

Sends an email using a predefined template.

#### Request Body

```json
{
  "templateType": "application_submitted",
  "context": {
    "driver": {
      "id": 12345,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "position_applied_for": "CDL Driver",
      "submitted_at": "2024-01-15T10:30:00Z"
    },
    "company": {
      "id": 1,
      "name": "ABC Trucking Company",
      "slug": "abc-trucking",
      "domain": "abctrucking.com"
    }
  },
  "options": {
    "to": "custom@example.com",
    "from": "custom@yourdomain.com",
    "customSubject": "Custom Subject"
  }
}
```

#### Response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "templateType": "application_submitted",
    "sentTo": "john.doe@example.com",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Available Template Types

- `application_submitted` - Application submission confirmation
- `application_approved` - Application approval notification
- `application_rejected` - Application rejection notification
- `background_check_initiated` - Background check initiation
- `background_check_completed` - Background check completion
- `document_requested` - Document request notification
- `welcome_email` - Welcome email for new team members
- `reminder_email` - Application reminder
- `expiration_warning` - Document expiration warning

---

### 2. Send Custom Email

**POST** `/api/v1/emails/send-custom`

Sends a completely custom email with your own HTML content.

#### Request Body

```json
{
  "to": "recipient@example.com",
  "from": "sender@yourdomain.com",
  "subject": "Custom Email Subject",
  "html": "<h1>Custom HTML Content</h1><p>This is a custom email.</p>",
  "text": "Custom text content"
}
```

#### Response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "sentTo": "recipient@example.com",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3. Send Application Submission Emails

**POST** `/api/v1/emails/application-submitted`

Sends both a confirmation email to the applicant and a notification email to the admin team.

#### Request Body

```json
{
  "application": {
    "id": 12345,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "position_applied_for": "CDL Driver",
    "submitted_at": "2024-01-15T10:30:00Z"
  },
  "company": {
    "id": 1,
    "name": "ABC Trucking Company",
    "slug": "abc-trucking",
    "domain": "abctrucking.com"
  },
  "adminEmail": "hr@abctrucking.com"
}
```

#### Response

```json
{
  "success": true,
  "message": "Application submission emails sent successfully",
  "data": {
    "applicantEmailSent": true,
    "adminEmailSent": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Send Background Check Emails

**POST** `/api/v1/emails/background-check`

Sends background check notification emails.

#### Request Body

```json
{
  "action": "initiated",
  "application": {
    "id": 12345,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "company": {
    "id": 1,
    "name": "ABC Trucking Company"
  }
}
```

#### Valid Actions

- `initiated` - Background check has started
- `completed` - Background check has finished

#### Response

```json
{
  "success": true,
  "message": "Background check initiated email sent successfully",
  "data": {
    "action": "initiated",
    "sentTo": "john.doe@example.com",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 5. Get Available Email Templates

**GET** `/api/v1/emails/templates`

Retrieves a list of all available email templates with their categories.

#### Response

```json
{
  "success": true,
  "message": "Email templates retrieved successfully",
  "data": {
    "templates": [
      {
        "type": "application_submitted",
        "name": "Application Submitted",
        "category": "Application"
      },
      {
        "type": "background_check_initiated",
        "name": "Background Check Initiated",
        "category": "Background Check"
      }
    ],
    "total": 12
  }
}
```

#### Template Categories

- **Application** - Application-related emails
- **Background Check** - Background check notifications
- **Document** - Document-related emails
- **Notification** - General notifications (welcome, reminders, etc.)
- **System** - System notifications and errors

---

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)

```json
{
  "success": false,
  "message": "Missing required fields: templateType and context",
  "error": "MISSING_REQUIRED_FIELDS"
}
```

### Email Send Failure (500)

```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "EMAIL_SEND_FAILED"
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Unknown error"
}
```

---

## Integration Examples

### Frontend Integration (JavaScript/TypeScript)

```typescript
// Send application submission emails
const sendApplicationEmails = async (application: any, company: any) => {
  try {
    const response = await fetch("/api/v1/emails/application-submitted", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application,
        company,
        adminEmail: "hr@company.com",
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Emails sent successfully");
    } else {
      console.error("Failed to send emails:", result.error);
    }
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};

// Send background check email
const sendBackgroundCheckEmail = async (
  action: "initiated" | "completed",
  application: any,
  company: any
) => {
  try {
    const response = await fetch("/api/v1/emails/background-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        application,
        company,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log(`Background check ${action} email sent`);
    } else {
      console.error("Failed to send email:", result.error);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
```

### cURL Examples

```bash
# Send template email
curl -X POST http://localhost:3000/api/v1/emails/send-template \
  -H "Content-Type: application/json" \
  -d '{
    "templateType": "application_submitted",
    "context": {
      "driver": {
        "id": 12345,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "company": {
        "name": "ABC Trucking Company"
      }
    }
  }'

# Send custom email
curl -X POST http://localhost:3000/api/v1/emails/send-custom \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello World</h1>"
  }'

# Get available templates
curl -X GET http://localhost:3000/api/v1/emails/templates
```

---

## Environment Variables

Make sure these environment variables are set:

```env
ZEPTOMAIL_API_TOKEN=your_zeptomail_api_token
ZEPTOMAIL_API_URL=api.zeptomail.com/
DEFAULT_FROM_EMAIL=noreply@trucking.mba
COMPANY_NAME=TruckingMBA
```

---

## Rate Limiting

Consider implementing rate limiting for these endpoints to prevent abuse:

- Limit to 10 emails per minute per IP
- Limit to 100 emails per hour per IP
- Implement exponential backoff for failed requests

---

## Monitoring

Monitor these endpoints for:

- Email delivery success rates
- API response times
- Error rates and types
- Usage patterns

Use the console logs to track email sending activities and troubleshoot issues.
