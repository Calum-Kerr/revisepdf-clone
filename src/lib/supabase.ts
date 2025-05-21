import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// User-related database functions
export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }

  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }

  return data;
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  provider?: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      provider: userData.provider || 'credentials',
      email_verified: false,
    })
    .select();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data[0];
};

export const updateUser = async (id: string, userData: Partial<{
  name: string;
  email: string;
  password: string;
  image: string;
  email_verified: boolean;
}>) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  return data[0];
};

export const createVerificationToken = async (token: string, email: string, expires: Date) => {
  const { error } = await supabase
    .from('verification_tokens')
    .insert({
      token,
      email: email.toLowerCase(),
      expires: expires.toISOString(),
    });

  if (error) {
    console.error('Error creating verification token:', error);
    throw error;
  }
};

export const getVerificationToken = async (token: string) => {
  const { data, error } = await supabase
    .from('verification_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    console.error('Error fetching verification token:', error);
    return null;
  }

  return data;
};

export const deleteVerificationToken = async (token: string) => {
  const { error } = await supabase
    .from('verification_tokens')
    .delete()
    .eq('token', token);

  if (error) {
    console.error('Error deleting verification token:', error);
    throw error;
  }
};

export const createPasswordResetToken = async (token: string, email: string, expires: Date) => {
  const { error } = await supabase
    .from('password_reset_tokens')
    .insert({
      token,
      email: email.toLowerCase(),
      expires: expires.toISOString(),
    });

  if (error) {
    console.error('Error creating password reset token:', error);
    throw error;
  }
};

export const getPasswordResetToken = async (token: string) => {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    console.error('Error fetching password reset token:', error);
    return null;
  }

  return data;
};

export const deletePasswordResetToken = async (token: string) => {
  const { error } = await supabase
    .from('password_reset_tokens')
    .delete()
    .eq('token', token);

  if (error) {
    console.error('Error deleting password reset token:', error);
    throw error;
  }
};
