import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASSWORD, // your app password
    },
});
