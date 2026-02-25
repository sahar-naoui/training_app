const nodemailer = require('nodemailer');

let transporter = null;
let mailConfigured = false;

function initTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || SMTP_USER === 'votre-email@gmail.com') {
    console.warn('[Mailer] SMTP non configuré — les emails seront simulés en console.');
    return false;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT) || 587,
    secure: parseInt(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  mailConfigured = true;
  console.log('[Mailer] Transporteur SMTP configuré avec succès.');
  return true;
}

async function sendReplyEmail({ to, contactName, originalSubject, replyMessage }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@qwestinum.com';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Qwesty-Training</h1>
        <p style="color: #e0e7ff; margin: 4px 0 0; font-size: 14px;">Réponse à votre demande</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="color: #334155; font-size: 15px;">Bonjour <strong>${contactName}</strong>,</p>
        <p style="color: #475569; font-size: 14px; margin-bottom: 4px;">Concernant votre demande : <em>"${originalSubject}"</em></p>
        <div style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #334155; font-size: 14px; white-space: pre-wrap; margin: 0; line-height: 1.6;">${replyMessage}</p>
        </div>
        <p style="color: #475569; font-size: 14px;">Cordialement,<br><strong>L'équipe Qwestinum</strong></p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">
        © ${new Date().getFullYear()} Qwestinum — Formations IA
      </p>
    </div>
  `;

  if (!mailConfigured) {
    console.log('[Mailer] === EMAIL SIMULÉ ===');
    console.log(`  De: ${from}`);
    console.log(`  À: ${to}`);
    console.log(`  Sujet: Re: ${originalSubject}`);
    console.log(`  Message: ${replyMessage}`);
    console.log('[Mailer] === FIN EMAIL ===');
    return { simulated: true, message: 'Email simulé (SMTP non configuré)' };
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject: `Re: ${originalSubject} — Qwesty-Training`,
    html: htmlContent,
  });

  console.log(`[Mailer] Email envoyé à ${to} — ID: ${info.messageId}`);
  return { simulated: false, messageId: info.messageId };
}

module.exports = { initTransporter, sendReplyEmail };
