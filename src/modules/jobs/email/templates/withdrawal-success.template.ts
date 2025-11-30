import { baseTemplate } from './base.template';

export const withdrawalSuccessTemplate = (data: {
  name: string;
  amount: string;
  bankName: string;
  accountNumber: string;
  date: string;
}) => {
  const content = `
    <h2>Withdrawal Successful 💸</h2>
    <p>Hi ${data.name},</p>
    <p>Your withdrawal request has been successfully processed. The funds should reflect in your bank account shortly.</p>
    
    <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #334155;">
      <div class="info-row">
        <div class="info-label">Amount</div>
        <div class="info-value" style="color: #22C55E;">${data.amount}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Bank</div>
        <div class="info-value">${data.bankName}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Account</div>
        <div class="info-value">****${data.accountNumber.slice(-4)}</div>
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
