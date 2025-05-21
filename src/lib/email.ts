import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { createVerificationToken, createPasswordResetToken } from './supabase';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
});

// Generate a random token
export const generateToken = () => {
  return randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email: string, name: string, locale: string = 'en-GB') => {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Store token in database
  await createVerificationToken(token, email, expires);
  
  // Create verification URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/${locale}/auth/verify-email?token=${token}`;
  
  // Email content
  const mailOptions = {
    from: `"RevisePDF" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email address',
    text: `Hello ${name},\n\nPlease verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you did not create an account with RevisePDF, please ignore this email.\n\nRegards,\nThe RevisePDF Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #238287; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">RevisePDF</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello ${name},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #238287; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account with RevisePDF, please ignore this email.</p>
          <p>Regards,<br>The RevisePDF Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>&copy; 2025 RevisePDF. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  
  // Send email
  await transporter.sendMail(mailOptions);
  
  return token;
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, locale: string = 'en-GB') => {
  const token = generateToken();
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  
  // Store token in database
  await createPasswordResetToken(token, email, expires);
  
  // Create reset URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/${locale}/auth/reset-password?token=${token}`;
  
  // Email content
  const mailOptions = {
    from: `"RevisePDF" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset your password',
    text: `Hello,\n\nYou requested to reset your password. Please click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.\n\nRegards,\nThe RevisePDF Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #238287; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">RevisePDF</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Hello,</p>
          <p>You requested to reset your password. Please click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #238287; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Regards,<br>The RevisePDF Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
          <p>&copy; 2025 RevisePDF. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  
  // Send email
  await transporter.sendMail(mailOptions);
  
  return token;
};
