import { baseTemplate } from './base.template';

export const bookingApprovedTemplate = (data: {
  borrowerName: string;
  itemName: string;
  bookingId: string;
}) => {
  const webUrl = `https://lendly.app/bookings/${data.bookingId}`;
  const appUrl = `lendly://bookings/${data.bookingId}`;

  const content = `
    <h2>Booking Approved! 🎉</h2>
    <p>Hi ${data.borrowerName},</p>
    <p>Great news! Your booking request for <strong>${data.itemName}</strong> has been approved by the owner.</p>
    
    <p>Your held funds will be released to the owner.</p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${appUrl}" class="button" style="margin-right: 10px;">View on App</a>
      <a href="${webUrl}" class="button" style="background-color: transparent; color: #22C55E; border: 1px solid #22C55E;">View on Web</a>
    </div>
  `;

  return baseTemplate(content);
};
