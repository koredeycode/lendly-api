import { baseTemplate } from './base.template';

export const bookingOverdueTemplate = (data: {
  borrowerName: string;
  itemName: string;
  bookingId: string;
}) => {
  const appUrl = `lendly://bookings/${data.bookingId}`;
  const webUrl = `https://lendly.app/bookings/${data.bookingId}`;

  const content = `
    <h2>Booking Overdue</h2>
    <p>Hi ${data.borrowerName},</p>
    <p>This is a reminder that your booking for <strong>${data.itemName}</strong> is now overdue.</p>
    
    <p>Please return the item as soon as possible to avoid additional charges or penalties.</p>
    
    <p>If you have already returned the item, please contact the owner to confirm the return.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="${appUrl}" class="button" style="margin-right: 10px;">View on App</a>
      <a href="${webUrl}" class="button" style="background-color: transparent; color: #22C55E; border: 1px solid #22C55E;">View on Web</a>
    </div>
  `;

  return baseTemplate(content);
};
