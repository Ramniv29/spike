'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { GoogleGenAI } from '@google/genai'

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
  const type = formData.get('type')
  let colorTag = type === 'event' ? 'event' : 'default'
  
  if (deadlineStr && type !== 'event') {
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

export async function updateTask(id, formData) {
  const supabase = await createClient()
  
  const deadlineStr = formData.get('deadline')
  const type = formData.get('type') // optional if we keep it
  let colorTag = formData.get('color_tag') || 'default'
  
  // Recalculate color tag if they pass deadline, assuming we only do this if colorTag isn't explicitly set to 'urgent' or something manually
  if (deadlineStr && type !== 'event' && (!colorTag || colorTag === 'default')) {
    const deadline = new Date(deadlineStr)
    const now = new Date()
    const diffHours = (deadline - now) / (1000 * 60 * 60)
    
    if (diffHours < 24) colorTag = 'urgent'
    else if (diffHours < 72) colorTag = 'pending'
  }

  const updates = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    deadline: deadlineStr ? new Date(deadlineStr).toISOString() : null,
    color_tag: colorTag,
  }

  const { error } = await supabase.from('tasks').update(updates).eq('id', id)
  
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

export async function deleteTasks(ids) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .delete()
    .in('id', ids)
    
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

export async function generateSubtasksAI(taskId, taskTitle) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: 'GEMINI_API_KEY is missing. Please add it to your environment variables.' }
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const prompt = `You are an AI assistant for a task manager called Strike. 
The user has a task: "${taskTitle}". 
Return exactly 3-5 actionable subtasks to complete it.
Output ONLY a raw JSON array of strings. Do not include markdown formatting or backticks.
Example: ["Subtask 1", "Subtask 2", "Subtask 3"]`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    let text = response.text.trim()
    // Fallback if the model includes markdown backticks anyway
    if (text.startsWith('```')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
    }
    
    const subtasksList = JSON.parse(text)
    
    const supabase = await createClient()
    const inserts = subtasksList.map(title => ({
      task_id: taskId,
      title: title,
      color_tag: 'default'
    }))

    const { error } = await supabase.from('subtasks').insert(inserts)
    if (error) return { error: error.message }
    
    revalidatePath('/dashboard')
    return { success: true, count: inserts.length }
  } catch (error) {
    console.error('AI Error:', error)
    return { error: 'Failed to generate subtasks with AI.' }
  }
}
