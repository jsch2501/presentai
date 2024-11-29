import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cdmrzgvnscpeceqamjkj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkbXJ6Z3Zuc2NwZWNlcWFtamtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NTI5MDMsImV4cCI6MjA0NTUyODkwM30.V5AvV9IZWMwikCKCj69ISAKEsFiZToLMqquiL70LRQ4'

const options = {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, options)
