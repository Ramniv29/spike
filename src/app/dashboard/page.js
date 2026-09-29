import { getTasks, signOut } from './actions'
import { TaskList } from '@/components/tasks/TaskList'
import { AddTaskModal } from '@/components/tasks/AddTaskModal'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, LayoutList, Calendar as CalendarIcon } from 'lucide-react'
import Background from '@/components/3d/Background'
import Link from 'next/link'
import { CalendarView } from '@/components/tasks/CalendarView'

export default async function DashboardPage({ searchParams }) {
  const supabase = await createClient()
  const params = await searchParams;
  const view = params?.view || 'list'
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const tasks = await getTasks()

  return (
    <>
      <Background />
      <div className="flex-1 flex flex-col min-h-screen pt-12 px-4 pb-24 sm:px-12 max-w-4xl mx-auto w-full z-10">
        <header className="flex justify-between items-end border-b border-neutral-800 pb-4 mb-8">
        <div>
          <h1 className="font-cursive text-5xl tracking-wide">Strike</h1>
          <p className="text-neutral-400 font-sans text-sm mt-2">
            Logged in as <span className="text-neutral-200">{user.email}</span>
          </p>
        </div>
        <form action={signOut}>
          <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer bg-neutral-900/50 px-4 py-2 rounded-lg border border-neutral-800 hover:border-neutral-500">
            <LogOut size={16} />
            <span className="font-sans text-sm tracking-wide">Sign Out</span>
          </button>
        </form>
      </header>

      <main className="flex-1">
        {/* View Toggle */}
        <div className="flex gap-4 mb-6 bg-black/40 backdrop-blur-md p-2 rounded w-fit border-2 border-white/10">
          <Link 
            href="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 font-sans font-bold uppercase tracking-widest text-xs transition-colors ${view === 'list' ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'text-neutral-400 hover:text-white'}`}
          >
            <LayoutList size={16} /> Strike
          </Link>
          <Link 
            href="/dashboard?view=calendar"
            className={`flex items-center gap-2 px-4 py-2 font-sans font-bold uppercase tracking-widest text-xs transition-colors ${view === 'calendar' ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'text-neutral-400 hover:text-white'}`}
          >
            <CalendarIcon size={16} /> Calendar
          </Link>
        </div>

        {view === 'calendar' ? (
          <CalendarView tasks={tasks} />
        ) : (
          <TaskList initialTasks={tasks} />
        )}
      </main>

        <AddTaskModal />
      </div>
    </>
  )
}
