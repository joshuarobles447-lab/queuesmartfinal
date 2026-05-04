import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const extra = Constants.expoConfig?.extra ?? {};
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  extra.supabaseUrl ||
  'https://fiptchcbhharnzoodcsz.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  extra.supabaseAnonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcHRjaGNiaGhhcm56b29kY3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDY2NDQsImV4cCI6MjA5MjUyMjY0NH0.vbqFtHSlZK8sb4-DzPDwe-0RCb8HELmEGWVgqkZPh4o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
