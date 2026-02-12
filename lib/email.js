import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, token) {
  const verifyUrl = `${process.env.BASE_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: "no-reply@store.nutrifarmdelight.in", // later change to your domain
    to,
    subject: "Verify your email",
    html: `
      <h2>Verify Your Email</h2>
      <p>Please click the link below to verify your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}

