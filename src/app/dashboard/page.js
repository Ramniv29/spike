import { getTasks, signOut } from './actions'
import { TaskList } from '@/components/tasks/TaskList'
import { AddTaskModal } from '@/components/tasks/AddTaskModal'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const tasks = await getTasks()

  return (
    <div className="flex-1 flex flex-col min-h-screen pt-12 px-4 pb-24 sm:px-12 max-w-4xl mx-auto w-full z-10">
      <header className="flex justify-between items-end border-b border-neutral-800 pb-4 mb-8">
        <div>
          <h1 className="font-cursive text-5xl tracking-wide">Strike</h1>
          <p className="text-neutral-400 font-sans text-sm mt-2">
            Logged in as <span className="text-neutral-200">{user.email}</span>
          </p>
        </div>
        <form action={signOut}>
          <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </form>
      </header>

      <main className="flex-1">
        <TaskList initialTasks={tasks} />
      </main>

      <AddTaskModal />
    </div>
  )
}
