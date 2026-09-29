'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    let errorMessage = error.message
    if (errorMessage === 'User already registered') {
      errorMessage = 'An account with this email already exists. Please log in.'
    }
    redirect(`/signup?message=${encodeURIComponent(errorMessage)}`)
  }

  // If we require email confirmation, they aren't logged in yet
  redirect('/login?message=Account created! Please check your inbox to confirm your email.')
}
