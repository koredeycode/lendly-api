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
      color: #FFFFFF;
      margin: 0;
      padding: 0;
      background-color: #0D1F18;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #1E293B;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      border: 1px solid #334155;
    }
    .header {
      background-color: #1E293B;
      color: #22C55E;
      padding: 32px 24px 24px;
      text-align: center;
      border-bottom: 1px solid #334155;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px 24px;
      color: #E2E8F0;
    }
    .footer {
      background-color: #0D1F18;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #9CA3AF;
      border-top: 1px solid #334155;
    }
    .button {
      display: inline-block;
      background-color: #22C55E;
      color: #FFFFFF;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 24px;
      text-align: center;
    }
    .button-secondary {
      background-color: transparent;
      border: 1px solid #22C55E;
      color: #22C55E;
    }
    .info-row {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #334155;
      display: flex;
      justify-content: space-between;
    }
    .info-label {
      font-weight: 500;
      color: #9CA3AF;
    }
    .info-value {
      color: #FFFFFF;
      font-weight: 600;
      text-align: right;
    }
    h2 {
      color: #FFFFFF;
      margin-top: 0;
    }
    p {
      margin-bottom: 16px;
    }
    strong {
      color: #22C55E;
    }
    a {
      color: #22C55E;
      text-decoration: none;
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
