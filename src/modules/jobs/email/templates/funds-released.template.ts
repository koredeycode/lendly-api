import { baseTemplate } from './base.template';

export const fundsReleasedTemplate = (data: {
  name: string;
  amount: string;
  itemName: string;
  reason?: string;
}) => {
  const content = `
    <h2>Funds Released 🔓</h2>
    <p>Hi ${data.name},</p>
    <p>The funds previously held for your booking have been released back to your available balance.</p>
    
    <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #334155;">
      <div class="info-row">
        <div class="info-label">Item</div>
        <div class="info-value">${data.itemName}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Amount Released</div>
        <div class="info-value" style="color: #22C55E;">${data.amount}</div>
      </div>
      ${
        data.reason
          ? `
      <div class="info-row" style="border-bottom: none;">
        <div class="info-label">Reason</div>
        <div class="info-value">${data.reason}</div>
      </div>
      `
          : ''
      }
    </div>

    <p>You can now use these funds for other bookings or withdraw them.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app/wallet" class="button">View Wallet</a>
    </div>
  `;

  return baseTemplate(content);
};
