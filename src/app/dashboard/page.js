import { getTasks, signOut } from './actions'
import { TaskList } from '@/components/tasks/TaskList'
import { AddTaskModal } from '@/components/tasks/AddTaskModal'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, LayoutList, Calendar as CalendarIcon, FileText } from 'lucide-react'
import Background from '@/components/3d/Background'
import Link from 'next/link'
import { CalendarView } from '@/components/tasks/CalendarView'
import { NotesView } from '@/components/tasks/NotesView'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { StatsModal } from '@/components/tasks/StatsModal'

export default async function DashboardPage({ searchParams }) {
  const supabase = await createClient()
  const params = await searchParams;
  const view = params?.view || 'list'
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const tasks = await getTasks()

  const pendingCount = tasks.filter(t => !t.is_completed && t.color_tag !== 'event' && t.category !== '_note').length
  const urgentCount = tasks.filter(t => !t.is_completed && t.color_tag === 'urgent' && t.category !== '_note').length
  const eventCount = tasks.filter(t => t.color_tag === 'event' && t.category !== '_note').length
  const completedCount = tasks.filter(t => t.is_completed && t.category !== '_note').length
  const totalMissions = pendingCount + completedCount
  const completionRate = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : (tasks.length === 0 ? 100 : 0)

  return (
    <>
      <Background />
      <KeyboardShortcuts />
      <div className="flex-1 flex flex-col min-h-screen pt-6 sm:pt-12 px-3 sm:px-12 pb-24 max-w-4xl mx-auto w-full z-10">
        <header className="flex justify-between items-end border-b border-neutral-800 pb-3 sm:pb-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-cursive text-3xl sm:text-5xl tracking-wide">Strike</h1>
            <p className="text-neutral-400 font-sans text-xs sm:text-sm mt-1 sm:mt-2 truncate max-w-[200px] sm:max-w-none">
              {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <StatsModal tasks={tasks} />
            <form action={signOut}>
              <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer bg-neutral-900/50 px-2 sm:px-4 py-2 rounded-lg border border-neutral-800 hover:border-neutral-500">
                <LogOut size={14} />
                <span className="font-sans text-xs sm:text-sm tracking-wide hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        {/* At-a-Glance Mission HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
          <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 rounded-lg p-3 sm:p-3.5 shadow-[2px_2px_0_rgba(255,255,255,0.06)]">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 block mb-1">Active Cases</span>
            <span className="font-sans font-black text-xl sm:text-2xl text-white">{pendingCount}</span>
          </div>
          <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 rounded-lg p-3 sm:p-3.5 shadow-[2px_2px_0_rgba(255,255,255,0.06)]">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 block mb-1">Urgent Threats</span>
            <span className={`font-sans font-black text-xl sm:text-2xl ${urgentCount > 0 ? 'text-red-500 font-bold' : 'text-neutral-300'}`}>{urgentCount}</span>
          </div>
          <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 rounded-lg p-3 sm:p-3.5 shadow-[2px_2px_0_rgba(255,255,255,0.06)]">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 block mb-1">Events Logged</span>
            <span className="font-sans font-black text-xl sm:text-2xl text-neutral-200">{eventCount}</span>
          </div>
          <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 rounded-lg p-3 sm:p-3.5 shadow-[2px_2px_0_rgba(255,255,255,0.06)]">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 block mb-1">Clear Desk Rate</span>
            <span className="font-sans font-black text-xl sm:text-2xl text-neutral-200">{completionRate}%</span>
          </div>
        </div>

        <main className="flex-1">
          {/* View Toggle */}
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 bg-black/40 backdrop-blur-md p-1.5 sm:p-2 rounded w-fit border-2 border-white/10">
            <Link 
              href="/dashboard"
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 font-sans font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors ${view === 'list' ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'text-neutral-400 hover:text-white'}`}
            >
              <LayoutList size={14} /> Strike
            </Link>
            <Link 
              href="/dashboard?view=calendar"
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 font-sans font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors ${view === 'calendar' ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'text-neutral-400 hover:text-white'}`}
            >
              <CalendarIcon size={14} /> Calendar
            </Link>
            <Link 
              href="/dashboard?view=notes"
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 font-sans font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors ${view === 'notes' ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'text-neutral-400 hover:text-white'}`}
            >
              <FileText size={14} /> Notes
            </Link>
          </div>

          {view === 'calendar' ? (
            <CalendarView tasks={tasks} />
          ) : view === 'notes' ? (
            <NotesView tasks={tasks} />
          ) : (
            <TaskList initialTasks={tasks} />
          )}
        </main>

        <AddTaskModal />
      </div>
    </>
  )
}
