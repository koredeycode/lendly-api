import { baseTemplate } from './base.template';

export const paymentSuccessTemplate = (data: {
  name: string;
  amount: string;
  transactionId: string;
  date: string;
}) => {
  const content = `
    <h2>Payment Successful! 💰</h2>
    <p>Hi ${data.name},</p>
    <p>Your payment has been successfully processed. Your wallet has been credited.</p>
    
    <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #334155;">
      <div class="info-row">
        <div class="info-label">Amount</div>
        <div class="info-value" style="color: #22C55E;">${data.amount}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Transaction ID</div>
        <div class="info-value">${data.transactionId}</div>
      </div>
      <div class="info-row" style="border-bottom: none;">
        <div class="info-label">Date</div>
        <div class="info-value">${data.date}</div>
      </div>
    </div>

    <p>Thank you for using Lendly!</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app/wallet" class="button">View Wallet</a>
    </div>
  `;

  return baseTemplate(content);
};
