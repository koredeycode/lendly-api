import { baseTemplate } from './base.template';

export const payoutReceivedTemplate = (data: {
  name: string;
  amount: string;
  itemName: string;
  bookingId: string;
}) => {
  const content = `
    <h2>You've Received a Payment! 💵</h2>
    <p>Hi ${data.name},</p>
    <p>Great news! The borrower has picked up the item, and your payment has been released.</p>
    
    <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #334155;">
      <div class="info-row">
        <div class="info-label">Item</div>
        <div class="info-value">${data.itemName}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Amount Received</div>
        <div class="info-value" style="color: #22C55E;">${data.amount}</div>
      </div>
      <div class="info-row" style="border-bottom: none;">
        <div class="info-label">Booking ID</div>
        <div class="info-value">${data.bookingId}</div>
      </div>
    </div>

    <p>The funds have been added to your Lendly wallet.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app/wallet" class="button">View Wallet</a>
    </div>
  `;

  return baseTemplate(content);
};
