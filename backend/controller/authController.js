import user from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import { transporter } from '../config/emailConfig.js';

// New user created

export async function registerUser(req, res) {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ success: false, message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Create token
        const token = crypto.randomBytes(32).toString("hex");
        newUser.verificationToken = token;
        newUser.verificationExpires = Date.now() + 10 * 60 * 1000;

        await newUser.save();

        // Create verification link
        const verifyURL = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const msg = `\n\nYour account has been successfully created on Personal Finance Assistant.\n\nThank you for registering!\n\nBest Regards,\nPersonal Finance Assistant Team\n\n`;
        await transporter.sendMail ({
            from: `"Finance App" <${process.env.EMAIL_USER}>`,
            to: req.body.email,
            subject: 'Account Creation Confirmation - Personal Finance Assistant',
            text:msg,
            html: `
                <h2>Hello ${newUser.name},</h2>
                <p>${msg}</p>
                <p>Please click the button below to verify your email:</p>
                <a href="${verifyURL}" 
                    style="display:inline-block; padding:10px 20px; background:#4f46e5; 
                    color:white; text-decoration:none; border-radius:5px;">
                    Verify Email
                </a>
                <p>This link will expire in <strong>10 minutes</strong>.</p>
            `
        })
        res.status(200).send({
            success: true,
            message: "Verification email sent! Please check your inbox."
        });

    } catch ( error ) {
        console.log(error);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
};

// User Login 

export async function doLogin(req, res) {
    try {
        const { email, password } = req.body;

        // find user
        const loginUser = await user.findOne({ email });

        if (!loginUser) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        // compare password
        const isPasswordValid = bcrypt.compareSync(password, loginUser.password);
        if (!isPasswordValid) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Choose secret key based on user role
        const secret_key =
            loginUser.role === "admin"
                ? process.env.ADMIN_SECRET_KEY
                : process.env.USER_SECRET_KEY;

        // create JWT token
        const token = jwt.sign(
            {
                id: loginUser._id,
                email: loginUser.email,
                role: loginUser.role
            },
            secret_key,
            { expiresIn: "2h" }
        );

        loginUser.lastLogin = new Date();
        await loginUser.save();

        return res.status(200).send({
            success: true,
            message: loginUser.role === "admin" ? "Admin login success" : "User login success",
            data: {
                name: loginUser.name,
                email: loginUser.email,
                role: loginUser.role,
                token: token
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Something went wrong..."
        });
    }
}

// verfy email by user 

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Email verified successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// forgot password controller
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user.findOne({ email });

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const msg = `\n\nYou have requested to reset your password. Please click the link below to reset it:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nPersonal Finance Assistant Team\n\n`;

        await transporter.sendMail ({
            from: `"Finance App" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request - Personal Finance Assistant',
            text:msg,
            html: `
                <h2>Hello ${user.name},</h2>
                <p>${msg}</p>
                <a href="${resetURL}" 
                    style="display:inline-block; padding:10px 20px; background:#4f46e5;
                    color:white; text-decoration:none; border-radius:5px;">
                    Reset Password
                </a>
                <p>This link will expire in <strong>15 minutes</strong>.</p>
            `
        })
        res.status(200).send({
            success: true,
            message: "Password reset email sent! Please check your inbox."
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
};
// reset password controller
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;
        const user = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send({ success: false, message: "Invalid or expired token" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).send({ success: true, message: "Password has been reset successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
};



