import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ofecyuceaovtljhxnaon.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZWN5dWNlYW92dGxqaHhuYW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc1OTQsImV4cCI6MjA5MTE0MzU5NH0.JMqjvcmS57suCA-W-qgWB8lsaUhKrDuuTITKV3I2q3Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
