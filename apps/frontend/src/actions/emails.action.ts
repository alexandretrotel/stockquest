"use server";

import { DEFAULT_RESEND_EMAIL } from "@/data/settings";
import { resend } from "@/lib/resend";
import AuthEmail from "@/components/emails/verification-email";

interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
  url: string;
}

/**
 * Sends an authentication-related email to a user, such as for verification or password reset.
 * Uses the Resend API to deliver the email with a custom React component for the email body.
 * Throws an error if the email fails to send.
 *
 * @param props - Email details and content
 * @param props.to - Recipient's email address
 * @param props.subject - Subject line of the email
 * @param props.text - Plain text content to display in the email body
 * @param props.url - URL for the user to visit (e.g., verification link)
 * @throws {Error} If the email fails to send, with details logged to the console
 */
export const sendAuthEmail = async ({
  to,
  subject,
  text,
  url,
}: SendEmailProps) => {
  const { error } = await resend.emails.send({
    from: `StockQuest <${DEFAULT_RESEND_EMAIL}>`,
    to,
    subject,
    react: AuthEmail({ url, text }),
  });

  if (error) {
    console.error(error);
    throw error;
  }
};
