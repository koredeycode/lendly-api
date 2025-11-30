export const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lendly Notification</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4F46E5;
      color: #ffffff;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 32px 24px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 16px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .button {
      display: inline-block;
      background-color: #4F46E5;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 16px;
    }
    .info-row {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f3f4f6;
    }
    .info-label {
      font-weight: 600;
      color: #4b5563;
    }
    .info-value {
      color: #111827;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Lendly</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Lendly. All rights reserved.</p>
      <p>This is an automated message, please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
`;
