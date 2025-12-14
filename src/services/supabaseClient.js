import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pkjelzfyglbgwwgfvclj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBramVsemZ5Z2xiZ3d3Z2Z2Y2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NjM2NTIsImV4cCI6MjA2OTIzOTY1Mn0.5Sw-c0QA4DDIrs_4LQS4tbl0I6wTtYuR5D7uu3UzbNE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
