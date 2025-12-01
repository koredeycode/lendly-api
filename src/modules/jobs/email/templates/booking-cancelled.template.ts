import { baseTemplate } from './base.template';

export const bookingCancelledTemplate = (data: {
  ownerName: string;
  borrowerName: string;
  itemName: string;
  bookingId: string;
}) => {
  const appUrl = `lendly://bookings/${data.bookingId}`;

  const content = `
    <h2>Booking Cancelled</h2>
    <p>Hi ${data.ownerName},</p>
    <p>The booking request from <strong>${data.borrowerName}</strong> for <strong>${data.itemName}</strong> has been cancelled by the borrower.</p>
    
    <p>No action is required from you. The item is now available for other borrowers.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="${appUrl}" class="button">View Booking</a>
    </div>
  `;

  return baseTemplate(content);
};
