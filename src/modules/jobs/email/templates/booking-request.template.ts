import { baseTemplate } from './base.template';

export const bookingRequestTemplate = (data: {
  ownerName: string;
  borrowerName: string;
  itemName: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  message?: string;
  bookingId: string;
}) => {
  const webUrl = `https://lendly.app/bookings/${data.bookingId}`;
  const appUrl = `lendly://bookings/${data.bookingId}`;

  const content = `
    <h2>New Booking Request! 📅</h2>
    <p>Hi ${data.ownerName},</p>
    <p><strong style="color: #22C55E;">${data.borrowerName}</strong> wants to rent your <strong>${data.itemName}</strong>.</p>
    
    <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #334155;">
      <div class="info-row">
        <div class="info-label">Item</div>
        <div class="info-value">${data.itemName}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Dates</div>
        <div class="info-value">${data.startDate} - ${data.endDate}</div>
      </div>
      <div class="info-row" style="border-bottom: none;">
        <div class="info-label">Total Earnings</div>
        <div class="info-value" style="color: #22C55E; font-weight: 700;">${data.totalPrice}</div>
      </div>
    </div>

    ${
      data.message
        ? `
      <div style="margin-bottom: 24px;">
        <p class="info-label">Message from ${data.borrowerName}:</p>
        <p style="font-style: italic; color: #9CA3AF; background-color: #0D1F18; padding: 12px; border-radius: 4px; border-left: 4px solid #22C55E;">
          "${data.message}"
        </p>
      </div>
    `
        : ''
    }

    <p>Please review this request as soon as possible.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="${appUrl}" class="button" style="margin-right: 10px;">View on App</a>
      <a href="${webUrl}" class="button" style="background-color: transparent; color: #22C55E; border: 1px solid #22C55E;">View on Web</a>
    </div>
  `;

  return baseTemplate(content);
};
