import { baseTemplate } from './base.template';

export const paymentFailedTemplate = (data: {
  name: string;
  amount: string;
  reason?: string;
  date: string;
}) => {
  const content = `
    <h2 style="color: #EF4444;">Payment Failed ❌</h2>
    <p>Hi ${data.name},</p>
    <p>We were unable to process your payment. No funds have been added to your wallet.</p>
    
    <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #334155;">
      <div class="info-row">
        <div class="info-label">Amount</div>
        <div class="info-value">${data.amount}</div>
      </div>
      <div class="info-row" style="border-bottom: none;">
        <div class="info-label">Date</div>
        <div class="info-value">${data.date}</div>
      </div>
      ${
        data.reason
          ? `
      <div class="info-row" style="border-top: 1px solid #334155; padding-top: 16px; border-bottom: none;">
        <div class="info-label">Reason</div>
        <div class="info-value" style="color: #EF4444;">${data.reason}</div>
      </div>
      `
          : ''
      }
    </div>

    <p>Please check your payment details and try again. If the issue persists, contact your bank or our support team.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app/wallet" class="button">Try Again</a>
    </div>
  `;

  return baseTemplate(content);
};
