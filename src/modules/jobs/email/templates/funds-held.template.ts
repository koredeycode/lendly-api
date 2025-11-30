import { baseTemplate } from './base.template';

export const fundsHeldTemplate = (data: {
  name: string;
  amount: string;
  itemName: string;
  bookingId: string;
}) => {
  const content = `
    <h2>Funds Held for Booking 🔒</h2>
    <p>Hi ${data.name},</p>
    <p>We have temporarily held funds in your wallet for your booking request.</p>
    
    <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #334155;">
      <div class="info-row">
        <div class="info-label">Item</div>
        <div class="info-value">${data.itemName}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Amount Held</div>
        <div class="info-value" style="color: #22C55E;">${data.amount}</div>
      </div>
      <div class="info-row" style="border-bottom: none;">
        <div class="info-label">Booking ID</div>
        <div class="info-value">${data.bookingId}</div>
      </div>
    </div>

    <p>These funds will be transferred to the owner once the booking is approved. If the booking is rejected or cancelled, the funds will be released back to your available balance.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app/bookings/${data.bookingId}" class="button">View Booking</a>
    </div>
  `;

  return baseTemplate(content);
};
