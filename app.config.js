const dotenv = require('dotenv');
dotenv.config();

module.exports = ({ config }) => ({
  ...config,
  name: "SmartQueue",
  slug: "smartqueue",
  web: {
    bundler: 'metro',
    output: 'static',
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  },
});