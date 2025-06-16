const nodemailer = require("nodemailer");
const { format } = require("path");
const sendEmail = async (to, subject, html) => {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kkpkpkp777@gmail.com',
                pass: 'zfvt lbjp ckfv opoa'
            }
        });

        await transporter.sendMail({
            from: '"My App" <kkpkpkp777@gmail.com>',
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Email sending failed: ${error.message}`);
    }
};

module.exports = sendEmail;