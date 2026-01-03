// for nodemailer
// import transporter from './getMailer.js';
// import dotenv from 'dotenv'
// dotenv.config({path:'../.env'});
// // dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// // Function to send emails
// const sendSMS = async (email, subject, message) => {

//     console.log("process.env.MAIL",process.env.MAIL)
//     console.log("process.env.MAILPASS",process.env.MAILPASS)
//     const mailOptions = {
//         from: "harshsrms30@gmail.com",
//         to: email,
//         subject: subject,
//         text: message
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${email}: ${info.response}`);
//         return { success: true, message: 'Email Sent' };
//     } catch (error) {
//         console.error(`Error sending email to ${email}:`, error);
//         // return { success: false, error: error.message };
//         throw error;
//     }
// };

// export default sendSMS;





// For resender
import resend from "./getMailer.js";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (email, subject, message) => {
  try {
    const response = await resend.emails.send({
      from: "BulkSMSScheduler <mercahnt@resend.dev>", // verified sender
      to: email,
      subject: subject,
      text: message,
    });

    console.log("✅ Email sent:", response);
    return { success: true };
  } catch (error) {
    console.error("❌ Email failed:", error);
    throw error;
  }
};

export default sendEmail;
