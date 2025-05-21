#!/usr/bin/env node

/**
 * This script sets up the Supabase database for the RevisePDF application.
 * It creates the necessary tables, functions, triggers, and policies.
 * 
 * Usage:
 * 1. Make sure you have the Supabase CLI installed: npm install -g supabase
 * 2. Set the SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables
 * 3. Run this script: node scripts/setup-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up Supabase database...');

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('pgexec', { sql: schemaSql });

    if (error) {
      throw error;
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
