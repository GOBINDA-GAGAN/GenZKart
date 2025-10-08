import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, // ✅ 'pass', not 'password'
  },
});

// Render EJS template
const renderTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`
  );

  try {
    const html = await ejs.renderFile(templatePath, data);
    return html;
  } catch (error) {
    console.error(`Error rendering template ${templateName}:`, error);
    throw new Error("Failed to render email template");
  }
};

// Example function to send an email
export const sendEmail = async (to: string, subject: string, templateName: string, data: any) => {
  try {
    const html = await renderTemplate(templateName, data);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
