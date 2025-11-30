import { baseTemplate } from './base.template';

export const bookingRequestTemplate = (data: {
  ownerName: string;
  borrowerName: string;
  itemName: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  message?: string;
  bookingUrl: string;
}) => {
  const content = `
    <h2>New Booking Request!</h2>
    <p>Hi ${data.ownerName},</p>
    <p><strong>${data.borrowerName}</strong> wants to rent your <strong>${data.itemName}</strong>.</p>
    
    <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin: 24px 0;">
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
        <div class="info-value" style="color: #059669; font-weight: 700;">${data.totalPrice}</div>
      </div>
    </div>

    ${
      data.message
        ? `
      <div style="margin-bottom: 24px;">
        <p class="info-label">Message from ${data.borrowerName}:</p>
        <p style="font-style: italic; color: #4b5563; background-color: #f3f4f6; padding: 12px; border-radius: 4px; border-left: 4px solid #4F46E5;">
          "${data.message}"
        </p>
      </div>
    `
        : ''
    }

    <p>Please review this request as soon as possible.</p>
    
    <div style="text-align: center;">
      <a href="${data.bookingUrl}" class="button">View Booking Request</a>
    </div>
  `;

  return baseTemplate(content);
};
