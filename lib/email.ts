import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "AI-kunskapen <noreply@adeprimo.se>";

function baseLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
  <div style="max-width: 480px; margin: 0 auto; padding: 48px 24px;">
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; background: #7546FF; color: white; font-weight: 800; font-size: 12px; padding: 8px 12px; border-radius: 10px; letter-spacing: -0.02em;">Ai</div>
    </div>

    ${content}

    <!-- Footer -->
    <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e8e4de;">
      <p style="color: #b5b0a8; font-size: 11px; text-align: center; margin: 0; line-height: 1.6;">
        AI-kunskapen — bidraget går till välgörenhet<br />
        Du får detta mejl för att någon bjudit in dig eller för att du begärt en inloggning.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendInvitationEmail(
  to: string,
  orgName: string,
  joinUrl: string
) {
  const html = baseLayout(`
    <!-- Heading -->
    <h1 style="font-size: 28px; font-weight: 800; text-align: center; margin: 0 0 8px; color: #1a1a1a; letter-spacing: -0.03em; text-transform: uppercase;">
      Du är inbjuden
    </h1>

    <p style="color: #7546FF; font-size: 13px; text-align: center; margin: 0 0 28px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
      ${orgName}
    </p>

    <!-- Body -->
    <p style="color: #555; font-size: 16px; line-height: 1.7; text-align: center; margin: 0 0 32px;">
      Din arbetsplats vill att du lär dig om AI — hur du använder det i vardagen och skyddar dig mot bedrägerier. Det tar ungefär 20 minuter.
    </p>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${joinUrl}" style="display: inline-block; background: #7546FF; color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; letter-spacing: -0.01em;">
        Börja kursen
      </a>
    </div>

    <!-- Subtext -->
    <p style="color: #999; font-size: 13px; text-align: center; line-height: 1.6; margin: 0;">
      Inga lösenord. Klicka på knappen och du är inne direkt.<br />
      Du kan pausa och komma tillbaka när du vill.
    </p>
  `);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `${orgName} bjuder in dig till AI-kunskapen`,
    html,
  });

  if (error) {
    console.error("Invitation email failed:", error);
    throw error;
  }

  return data;
}

export async function sendMagicLinkEmail(to: string, loginUrl: string) {
  const html = baseLayout(`
    <!-- Heading -->
    <h1 style="font-size: 28px; font-weight: 800; text-align: center; margin: 0 0 24px; color: #1a1a1a; letter-spacing: -0.03em; text-transform: uppercase;">
      Logga in
    </h1>

    <!-- Body -->
    <p style="color: #555; font-size: 16px; line-height: 1.7; text-align: center; margin: 0 0 32px;">
      Klicka på knappen nedan för att logga in.<br />
      Länken gäller i 15 minuter.
    </p>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${loginUrl}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; letter-spacing: -0.01em;">
        Logga in
      </a>
    </div>

    <!-- Subtext -->
    <p style="color: #999; font-size: 13px; text-align: center; line-height: 1.6; margin: 0;">
      Har du inte begärt detta? Ignorera mejlet.
    </p>
  `);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Din inloggningslänk — AI-kunskapen",
    html,
  });

  if (error) {
    console.error("Magic link email failed:", error);
    throw error;
  }

  return data;
}
