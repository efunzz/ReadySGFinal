import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://nlsvbdbfjjgryljsferw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sc3ZiZGJmampncnlsanNmZXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTA4NjUsImV4cCI6MjA2ODA4Njg2NX0.9H22HwYzsnuIj0bwaeWoutd6oMSgr5P57dHhhO8dO58"
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})