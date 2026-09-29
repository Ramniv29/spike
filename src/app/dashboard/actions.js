'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getTasks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      subtasks (*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
  return data
}

export async function addTask(formData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const deadlineStr = formData.get('deadline')
  let colorTag = 'default'
  
  if (deadlineStr) {
    const deadline = new Date(deadlineStr)
    const now = new Date()
    const diffHours = (deadline - now) / (1000 * 60 * 60)
    
    if (diffHours < 24) colorTag = 'urgent'
    else if (diffHours < 72) colorTag = 'pending'
  }

  const task = {
    user_id: user.id,
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    deadline: deadlineStr ? new Date(deadlineStr).toISOString() : null,
    color_tag: colorTag,
  }

  const { error } = await supabase.from('tasks').insert([task])
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleTask(id, currentStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: !currentStatus })
    .eq('id', id)
    
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function addSubtask(formData) {
  const supabase = await createClient()
  
  const subtask = {
    task_id: formData.get('task_id'),
    title: formData.get('title'),
    color_tag: formData.get('color_tag') || null,
  }

  const { error } = await supabase.from('subtasks').insert([subtask])
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleSubtask(id, currentStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('subtasks')
    .update({ is_completed: !currentStatus })
    .eq('id', id)
    
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteTask(id) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteSubtask(id) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('subtasks')
    .delete()
    .eq('id', id)
    
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
