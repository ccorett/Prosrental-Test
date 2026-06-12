import { createMailTransporter, getSmtpConfig } from "@/lib/mail/smtp";

export type QuoteRequestDetails = {
  fullName: string;
  phone: string;
  email: string;
  equipment: string;
  rentalStartDate: string;
  rentalDuration: string;
  deliveryRequired: string;
  location: string;
  message: string;
};

function formatQuoteEmailBody(details: QuoteRequestDetails): string {
  const lines = [
    "A new quote request was submitted on the Pro Rentals website.",
    "",
    `Full name: ${details.fullName}`,
    `Phone number: ${details.phone}`,
    `Email: ${details.email}`,
    `Equipment requested: ${details.equipment}`,
    `Rental start date: ${details.rentalStartDate}`,
    `Rental duration: ${details.rentalDuration}`,
    `Delivery required: ${details.deliveryRequired}`,
    `Location: ${details.location}`,
    `Message / special requirements: ${details.message || "(none)"}`,
  ];

  return lines.join("\n");
}

export async function sendQuoteNotificationEmail(
  details: QuoteRequestDetails
): Promise<void> {
  const config = getSmtpConfig();
  const transporter = createMailTransporter(config);

  await transporter.sendMail({
    from: config.user,
    to: config.notificationEmail,
    replyTo: details.email,
    subject: "New Quote Request - Pro Rentals",
    text: formatQuoteEmailBody(details),
  });
}
