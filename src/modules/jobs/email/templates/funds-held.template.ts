export const fundsHeldTemplate = (data: {
  name: string;
  amount: string;
  itemName: string;
  bookingId: string;
}) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Funds Held for Booking</h1>
        </div>
        <div class="content">
            <p>Hi ${data.name},</p>
            <p>We have temporarily held funds in your wallet for your booking request.</p>
            
            <div class="details">
                <p><strong>Item:</strong> ${data.itemName}</p>
                <p><strong>Amount Held:</strong> ${data.amount}</p>
                <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            </div>

            <p>These funds will be transferred to the owner once the booking is approved. If the booking is rejected or cancelled, the funds will be released back to your available balance.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Lendly. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
