import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const extra = Constants.expoConfig?.extra ?? {};
const supabaseUrl =
  process.env.SUPABASE_URL ||
  extra.supabaseUrl ||
  'https://fiptchcbhharnzoodcsz.supabase.co';
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  extra.supabaseAnonKey ||
  'sb_publishable_g61sWXQu-BZNmV61BEGymQ_V9w91yJR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
