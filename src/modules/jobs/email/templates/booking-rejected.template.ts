import { baseTemplate } from './base.template';

export const bookingRejectedTemplate = (data: {
  borrowerName: string;
  itemName: string;
  bookingId: string;
}) => {
  const webUrl = `https://lendly.app/bookings/${data.bookingId}`;
  const appUrl = `lendly://bookings/${data.bookingId}`;

  const content = `
    <h2>Booking Update</h2>
    <p>Hi ${data.borrowerName},</p>
    <p>We're sorry to inform you that your booking request for <strong>${data.itemName}</strong> has been declined by the owner.</p>
    
    <p>Any funds held for this booking have been released back to your wallet.</p>
    
    <p>Don't worry, there are plenty of other items available on Lendly!</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="${appUrl}" class="button" style="margin-right: 10px;">View on App</a>
      <a href="${webUrl}" class="button" style="background-color: transparent; color: #22C55E; border: 1px solid #22C55E;">View on Web</a>
      <div style="margin-top: 12px;">
        <a href="https://lendly.app" style="color: #64748B; text-decoration: none; font-size: 14px;">Browse other items</a>
      </div>
    </div>
  `;

  return baseTemplate(content);
};
