import { baseTemplate } from './base.template';

export const welcomeTemplate = (data: { name: string }) => {
  const content = `
    <h2>Welcome to Lendly! 👋</h2>
    <p>Hi ${data.name},</p>
    <p>We're thrilled to have you join our community of lenders and borrowers.</p>
    
    <p>With Lendly, you can:</p>
    <ul style="color: #E2E8F0;">
      <li><strong style="color: #22C55E;">Rent items</strong> you need for a fraction of the cost.</li>
      <li><strong style="color: #22C55E;">Earn money</strong> by lending out items you own.</li>
    </ul>

    <p>Ready to get started?</p>
    
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://lendly.app" class="button">Explore Items</a>
    </div>
  `;

  return baseTemplate(content);
};
