import 'dotenv/config';

export default {
  expo: {
    name: "foodapp",
    slug: "foodapp",
    version: "1.0.0",
    orientation: "portrait",
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
