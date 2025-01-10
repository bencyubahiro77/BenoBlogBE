import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (to: string, name: string, password: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.AdminEmail,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.AdminEmail,
            to: to,
            subject: 'Welcome to Our Platform',
            text: `Hi ${name},\n\nWelcome to our platform! Your credentials  Email: ${to} and password is: ${password}\n\nBest regards,`,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw err; // Propagate the error if needed
    }
};
