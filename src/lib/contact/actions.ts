"use server";

import { sendQuoteNotificationEmail } from "@/lib/mail/send-quote-notification";

export type QuoteRequestResult = {
  error?: string;
  success?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitQuoteRequest(
  _prev: QuoteRequestResult,
  formData: FormData
): Promise<QuoteRequestResult> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const equipment = String(formData.get("equipment") ?? "").trim();
  const rentalStartDate = String(formData.get("startDate") ?? "").trim();
  const rentalDuration = String(formData.get("duration") ?? "").trim();
  const deliveryRequired = String(formData.get("delivery") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!fullName) {
    return { error: "Full name is required." };
  }

  if (!phone) {
    return { error: "Phone number is required." };
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "A valid email address is required." };
  }

  if (!equipment) {
    return { error: "Equipment requested is required." };
  }

  if (!rentalStartDate) {
    return { error: "Rental start date is required." };
  }

  if (!rentalDuration) {
    return { error: "Rental duration is required." };
  }

  if (!deliveryRequired) {
    return { error: "Please indicate whether delivery is required." };
  }

  if (!location) {
    return { error: "Location is required." };
  }

  try {
    await sendQuoteNotificationEmail({
      fullName,
      phone,
      email,
      equipment,
      rentalStartDate,
      rentalDuration,
      deliveryRequired: deliveryRequired === "yes" ? "Yes" : "No",
      location,
      message,
    });

    return { success: true };
  } catch (error) {
    console.error("Quote request email failed:", error);
    return {
      error:
        "We couldn't send your quote request right now. Please call or WhatsApp us and we'll help you directly.",
    };
  }
}
