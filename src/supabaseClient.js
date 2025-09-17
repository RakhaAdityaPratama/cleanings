import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xpndmsvnroypbqlubkxs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbmRtc3Zucm95cGJxbHVia3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNzUzMDcsImV4cCI6MjA3MzY1MTMwN30.AoxysZl51hE6ACUiOLgJUgSTxNjZeOcfLRqQgqJfNwg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
