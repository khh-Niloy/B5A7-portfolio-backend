import nodemailer from "nodemailer";
import { envVars } from "../../config/envVars";
import { IContact } from "./contact.interface";
import { Contact } from "./contact.model";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS ? envVars.EMAIL_PASS.replace(/\s+/g, "") : "",
  },
});

const createContactMessage = async (payload: IContact) => {
  // 1. Persist the message in MongoDB
  const savedContact = await Contact.create(payload);

  // 2. Send email notification to portfolio owner
  if (envVars.EMAIL_USER && envVars.EMAIL_PASS) {
    const mailOptions = {
      from: `"Portfolio Contact Form" <${envVars.EMAIL_USER}>`,
      to: envVars.EMAIL_USER,
      replyTo: payload.email,
      subject: `Portfolio Message from ${payload.name}`,
      text: `You received a new message from your portfolio contact form:\n\nName: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: 700;">New Portfolio Message</h2>
            <span style="font-size: 12px; color: #6b7280;">Received via portfolio direct message form</span>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px; width: 80px;">Sender:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${payload.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-size: 13px;">Email:</td>
              <td style="padding: 6px 0; color: #111827; font-size: 14px;"><a href="mailto:${payload.email}" style="color: #10b981; text-decoration: none;">${payload.email}</a></td>
            </tr>
          </table>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.05em;">Message</p>
            <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${payload.message}</p>
          </div>

          <div style="font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 14px;">
            Hit "Reply" to respond directly to ${payload.email}
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Nodemailer failed to dispatch email:", error);
    }
  }

  return savedContact;
};

const getAllContactMessages = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

const deleteContactMessage = async (id: string) => {
  return await Contact.findByIdAndDelete(id);
};

export const contactServices = {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage,
};
