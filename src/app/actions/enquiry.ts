"use server";

import { collections, isDbConfigured } from "@/lib/db";

export type EnquiryResult = { ok: boolean; message: string };

const field = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? "").trim().slice(0, max);

/** Save a booking enquiry from one of the public contact forms. Read them under /admin/enquiries. */
export async function submitEnquiry(page: "chaithrika" | "nihan", formData: FormData): Promise<EnquiryResult> {
  // Simple honeypot: real visitors never fill the hidden "website" field.
  if (field(formData, "website")) return { ok: true, message: "Thank you — your note has been sent." };

  const name = field(formData, "name");
  const contact = field(formData, "contact") || field(formData, "email");
  const message = field(formData, "message", 5000);
  if (!name) return { ok: false, message: "Please add your name." };
  if (!contact && !message) return { ok: false, message: "Please add a way to reach you, or a message." };

  if (!isDbConfigured()) {
    return { ok: false, message: "Online enquiries aren't connected yet — please contact the parents directly." };
  }
  try {
    const { enquiries } = await collections();
    await enquiries.insertOne({
      page: page === "nihan" ? "nihan" : "chaithrika",
      name,
      company: field(formData, "company"),
      contact,
      type: field(formData, "type"),
      message,
      read: false,
      createdAt: new Date(),
    });
    return { ok: true, message: "Thank you — your note has been sent. The parents will reply personally." };
  } catch (err) {
    console.error("[enquiry] save failed", err);
    return { ok: false, message: "Sorry, that didn't send. Please try again in a moment." };
  }
}
