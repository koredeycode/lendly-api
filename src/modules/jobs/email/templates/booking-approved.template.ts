import { baseTemplate } from './base.template';

export const bookingApprovedTemplate = (data: {
  borrowerName: string;
  itemName: string;
  bookingUrl?: string;
}) => {
  const content = `
    <h2>Booking Approved! 🎉</h2>
    <p>Hi ${data.borrowerName},</p>
    <p>Great news! Your booking request for <strong>${data.itemName}</strong> has been approved by the owner.</p>
    
    <p>Your held funds will be released to the owner.</p>

    ${
      data.bookingUrl
        ? `
    <div style="text-align: center; margin-top: 24px;">
      <a href="${data.bookingUrl}" class="button">View Booking</a>
    </div>
    `
        : ''
    }
  `;

  return baseTemplate(content);
};
