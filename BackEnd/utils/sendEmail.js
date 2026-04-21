const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: `"ShopNow" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (err) {
        console.error("Error while sending mail:", err);
        throw err;
    }
};

module.exports = sendEmail;