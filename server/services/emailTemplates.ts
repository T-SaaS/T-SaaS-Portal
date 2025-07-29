import type { EmailContext } from "./emailService";

/**
 * Email template manager for organizing and managing email templates
 */
export class EmailTemplateManager {
  /**
   * Get application submitted template
   */
  static getApplicationSubmittedTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Submitted</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .info-box li {
            margin: 5px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Submitted Successfully</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${
      driver.last_name
    }</strong>,</p>
            <p>Thank you for submitting your driver application to <strong>${
              company.name
            }</strong>.</p>
            <p>Your application has been received and is currently under review.</p>
            
            <div class="info-box">
              <h3>Application Details:</h3>
              <ul>
                <li><strong>Application ID:</strong> ${driver.id}</li>
                <li><strong>Position:</strong> ${
                  driver.position_applied_for
                }</li>
                <li><strong>Submitted:</strong> ${new Date(
                  driver.submitted_at
                ).toLocaleDateString()}</li>
                <li><strong>Email:</strong> ${driver.email}</li>
              </ul>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>We will review your application within 3-5 business days</li>
              <li>You'll receive an email with next steps</li>
              <li>If approved, we'll initiate background checks</li>
              <li>You may be asked to provide additional documentation</li>
            </ul>
            
            <p>If you have any questions about your application, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get application approved template
   */
  static getApplicationApprovedTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Approved</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .success-box {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .next-steps {
            background-color: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Application Approved!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="success-box">
              <h2 style="margin-top: 0; color: #155724;">Congratulations!</h2>
              <p>Your driver application has been <strong>approved</strong> by ${company.name}.</p>
              <p>Your application met all our requirements and background check standards.</p>
            </div>
            
            <div class="next-steps">
              <h3>📋 Next Steps:</h3>
              <ul>
                <li><strong>Complete Onboarding:</strong> Fill out any remaining paperwork</li>
                <li><strong>Drug Test:</strong> Schedule your drug test (if not already completed)</li>
                <li><strong>Orientation:</strong> Attend orientation (details to follow)</li>
                <li><strong>Equipment:</strong> Receive your company equipment and credentials</li>
              </ul>
            </div>
            
            <p>Our team will contact you within the next 24-48 hours to coordinate these next steps.</p>
            
            <p>We're excited to have you join our team and look forward to working with you!</p>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get application rejected template
   */
  static getApplicationRejectedTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Status Update</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .notice-box {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .contact-info {
            background-color: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="notice-box">
              <h2 style="margin-top: 0; color: #721c24;">Application Status Update</h2>
              <p>After careful review of your application for ${company.name}, we regret to inform you that we are unable to move forward with your application at this time.</p>
            </div>
            
            <p>This decision was based on our review of your application materials and background check results.</p>
            
            <div class="contact-info">
              <h3>📞 Questions?</h3>
              <p>If you have questions about this decision or would like to discuss your application further, please contact our team directly.</p>
              <p>We appreciate your interest in joining our team and wish you the best in your future endeavors.</p>
            </div>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get background check initiated template
   */
  static getBackgroundCheckInitiatedTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Background Check Initiated</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .info-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .timeline {
            background-color: #f8f9fa;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔍 Background Check Initiated</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="info-box">
              <h2 style="margin-top: 0; color: #856404;">Background Check Started</h2>
              <p>We have initiated your background check as part of the application process for <strong>${company.name}</strong>.</p>
            </div>
            
            <div class="timeline">
              <h3>⏱️ Timeline:</h3>
              <ul>
                <li><strong>Duration:</strong> 3-5 business days</li>
                <li><strong>Notification:</strong> You'll receive an email once completed</li>
                <li><strong>Next Steps:</strong> We'll contact you with results and next steps</li>
              </ul>
            </div>
            
            <p><strong>What we're checking:</strong></p>
            <ul>
              <li>Criminal history</li>
              <li>Driving record</li>
              <li>Employment verification</li>
              <li>Other relevant background information</li>
            </ul>
            
            <p>If you have any questions about this process, please contact us.</p>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get background check completed template
   */
  static getBackgroundCheckCompletedTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Background Check Completed</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .success-box {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .next-steps {
            background-color: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Background Check Completed</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="success-box">
              <h2 style="margin-top: 0; color: #155724;">Background Check Complete</h2>
              <p>Your background check for <strong>${company.name}</strong> has been completed successfully.</p>
            </div>
            
            <div class="next-steps">
              <h3>📋 Next Steps:</h3>
              <p>Our team will review the results and contact you within 1-2 business days with next steps in the application process.</p>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get document requested template
   */
  static getDocumentRequestedTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Additional Documents Required</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .notice-box {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .documents-list {
            background-color: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .documents-list ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .documents-list li {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Additional Documents Required</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="notice-box">
              <h2 style="margin-top: 0; color: #721c24;">Action Required</h2>
              <p>We need additional documentation to complete your application for <strong>${company.name}</strong>.</p>
            </div>
            
            <div class="documents-list">
              <h3>📋 Required Documents:</h3>
              <ul>
                <li><strong>Driver's License:</strong> Clear, legible copy of your current driver's license</li>
                <li><strong>Medical Certificate:</strong> Current DOT medical certificate</li>
                <li><strong>Additional Documents:</strong> Any other documentation as requested by our team</li>
              </ul>
            </div>
            
            <p><strong>How to submit:</strong></p>
            <ul>
              <li>Upload through your application portal</li>
              <li>Email to our support team</li>
              <li>Contact us for alternative submission methods</li>
            </ul>
            
            <p>Please submit these documents within 7 days to avoid delays in your application process.</p>
            
            <p>If you have any questions or need assistance, please contact us immediately.</p>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get welcome email template
   */
  static getWelcomeEmailTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${company.name}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .welcome-box {
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👋 Welcome to ${company.name}!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="welcome-box">
              <h2 style="margin-top: 0; color: #1565c0;">Welcome to the Team!</h2>
              <p>We're excited to welcome you to <strong>${company.name}</strong>!</p>
            </div>
            
            <p>Your application has been approved and you're now part of our team. We're looking forward to working with you.</p>
            
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>Orientation details will be sent separately</li>
              <li>You'll receive your company credentials</li>
              <li>Training and onboarding will be scheduled</li>
              <li>Our team will be in touch with next steps</li>
            </ul>
            
            <p>If you have any questions, please don't hesitate to reach out to our team.</p>
            
            <p>Welcome aboard!<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get reminder email template
   */
  static getReminderEmailTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Reminder</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .reminder-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Application Reminder</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="reminder-box">
              <h2 style="margin-top: 0; color: #856404;">Friendly Reminder</h2>
              <p>This is a reminder about your pending application with <strong>${company.name}</strong>.</p>
            </div>
            
            <p>We noticed that your application is still in progress. To move forward with your application, please:</p>
            <ul>
              <li>Complete any missing information</li>
              <li>Submit required documents</li>
              <li>Respond to any pending requests</li>
            </ul>
            
            <p>If you need assistance or have questions, please contact us immediately.</p>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get expiration warning template
   */
  static getExpirationWarningTemplate(context: EmailContext): string {
    const { driver, company } = context;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Expiration Warning</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px; 
          }
          .footer { 
            background-color: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .warning-box {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Document Expiration Warning</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${driver.first_name} ${driver.last_name}</strong>,</p>
            
            <div class="warning-box">
              <h2 style="margin-top: 0; color: #721c24;">Important Notice</h2>
              <p>One or more of your documents with <strong>${company.name}</strong> are approaching expiration.</p>
            </div>
            
            <p><strong>Documents requiring renewal:</strong></p>
            <ul>
              <li>Driver's License</li>
              <li>Medical Certificate</li>
              <li>Other required certifications</li>
            </ul>
            
            <p>Please renew these documents before they expire to maintain compliance and avoid any service interruptions.</p>
            
            <p>If you have any questions or need assistance, please contact us immediately.</p>
            
            <p>Best regards,<br>
            The ${company.name} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ${company.name}</p>
            <p>Please do not reply to this email. For support, contact our team directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
