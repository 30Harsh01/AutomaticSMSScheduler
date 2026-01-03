// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config({path:'./.env'});

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.MAIL,
//     pass: process.env.MAILPASS,
//   },
// });

// transporter.verify()
//   .then(() => console.log('✅ SMTP transporter verified'))
//   .catch(err => console.error('❌ SMTP transporter verification failed:', err));

// export default transporter;




import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
