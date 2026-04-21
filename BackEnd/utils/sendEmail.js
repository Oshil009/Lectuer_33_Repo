// utils/sendEmail.js
const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmail = async (options) => { 
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"ShopNow" <${process.env.SMTP_USER}>`,
            to: options.email,   
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: " + info.messageId);
        return info;
    } catch (error) {
        console.error("Error in sendEmail utility:", error.message);
        throw error;
    }
};

module.exports = sendEmail;