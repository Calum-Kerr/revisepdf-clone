import { randomBytes } from 'crypto';
import { supabase } from './supabase';
import { createVerificationToken, createPasswordResetToken } from './supabase';

/**
 * Generate a random token for email verification or password reset
 */
export const generateToken = (): string => {
  return randomBytes(32).toString('hex');
};

/**
 * Send verification email using Supabase's email service
 * 
 * @param email - User's email address
 * @param name - User's name
 * @param locale - User's locale (default: en-GB)
 * @returns The generated token
 */
export const sendVerificationEmail = async (
  email: string, 
  name: string, 
  locale: string = 'en-GB'
): Promise<string> => {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Store token in database
  await createVerificationToken(token, email, expires);
  
  // Create verification URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/${locale}/auth/verify-email?token=${token}`;
  
  // Send email using Supabase
  const { error } = await supabase.auth.admin.sendInviteEmail({
    email,
    options: {
      data: {
        name,
        verificationUrl,
        token,
        locale,
        type: 'verification',
      },
    },
  });
  
  if (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
  
  return token;
};

/**
 * Send password reset email using Supabase's email service
 * 
 * @param email - User's email address
 * @param locale - User's locale (default: en-GB)
 * @returns The generated token
 */
export const sendPasswordResetEmail = async (
  email: string, 
  locale: string = 'en-GB'
): Promise<string> => {
  const token = generateToken();
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  
  // Store token in database
  await createPasswordResetToken(token, email, expires);
  
  // Create reset URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/${locale}/auth/reset-password?token=${token}`;
  
  // Send email using Supabase
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetUrl,
    data: {
      token,
      locale,
      type: 'reset',
    },
  });
  
  if (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
  
  return token;
};
