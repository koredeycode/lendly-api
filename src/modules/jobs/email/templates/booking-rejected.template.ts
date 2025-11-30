import { baseTemplate } from './base.template';

export const bookingRejectedTemplate = (data: {
  borrowerName: string;
  itemName: string;
}) => {
  const content = `
    <h2>Booking Update</h2>
    <p>Hi ${data.borrowerName},</p>
    <p>We're sorry to inform you that your booking request for <strong>${data.itemName}</strong> has been declined by the owner.</p>
    
    <p>Any funds held for this booking have been released back to your wallet.</p>
    
    <p>Don't worry, there are plenty of other items available on Lendly!</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app" class="button">Browse Other Items</a>
    </div>
  `;

  return baseTemplate(content);
};
