import { baseTemplate } from './base.template';

export const withdrawalFailedTemplate = (data: {
  name: string;
  amount: string;
  reason?: string;
  date: string;
}) => {
  const content = `
    <h2 style="color: #EF4444;">Withdrawal Failed ❌</h2>
    <p>Hi ${data.name},</p>
    <p>Your withdrawal request could not be processed. The funds have been returned to your Lendly wallet.</p>
    
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

    <p>Please verify your bank details and try again.</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app/wallet" class="button">Check Wallet</a>
    </div>
  `;

  return baseTemplate(content);
};
