export const withdrawalSuccessTemplate = (data: {
  name: string;
  amount: string;
  bankName: string;
  accountNumber: string;
  date: string;
}) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Withdrawal Successful</h1>
        </div>
        <div class="content">
            <p>Hi ${data.name},</p>
            <p>Your withdrawal request has been successfully processed. The funds should reflect in your bank account shortly.</p>
            
            <div class="details">
                <p><strong>Amount:</strong> ${data.amount}</p>
                <p><strong>Bank:</strong> ${data.bankName}</p>
                <p><strong>Account:</strong> ****${data.accountNumber.slice(-4)}</p>
                <p><strong>Date:</strong> ${data.date}</p>
            </div>

            <p>Thank you for using Lendly!</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Lendly. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
