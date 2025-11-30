export const paymentFailedTemplate = (data: {
  name: string;
  amount: string;
  reason?: string;
  date: string;
}) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Failed</h1>
        </div>
        <div class="content">
            <p>Hi ${data.name},</p>
            <p>We were unable to process your payment. No funds have been added to your wallet.</p>
            
            <div class="details">
                <p><strong>Amount:</strong> ${data.amount}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
            </div>

            <p>Please check your payment details and try again. If the issue persists, contact your bank or our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Lendly. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
