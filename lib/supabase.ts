import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Debug: Log client initialization (only the first few characters of the URL)
console.log('Initializing Supabase client with URL:', supabaseUrl.slice(0, 10) + '...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Since we're only using it for data fetching
  }
})

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('service_status').select('count').single()
    if (error) {
      console.error('Supabase connection test failed:', error.message)
    } else {
      console.log('Supabase connection test successful')
    }
  } catch (error: unknown) {
    console.error('Supabase connection test error:', error instanceof Error ? error.message : 'Unknown error')
  }
}

// Run the test
testConnection() 