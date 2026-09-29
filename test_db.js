import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = fs.readFileSync('.env.local', 'utf8')
const envVars = Object.fromEntries(env.split('\n').filter(Boolean).map(line => line.split('=')))

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function test() {
  const { data, error } = await supabase.from('notes').select('*').limit(1)
  console.log(error ? error.message : 'Notes table exists.')
}
test()
