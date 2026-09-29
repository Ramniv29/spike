'use client'

import { useState } from 'react'
import { BarChart3, X } from 'lucide-react'

export function StatsModal({ tasks }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer bg-neutral-900/50 px-2 sm:px-4 py-2 rounded-lg border border-neutral-800 hover:border-neutral-500"
      >
        <BarChart3 size={14} />
        <span className="font-sans text-xs sm:text-sm tracking-wide hidden sm:inline">Stats</span>
      </button>
    )
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.is_completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // Calculate cases closed in the last 7 days
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const recentlyCompleted = tasks.filter(t => t.is_completed && new Date(t.created_at) > sevenDaysAgo).length

  // Busiest day
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayCounts = {}
  tasks.forEach(t => {
    const day = new Date(t.created_at).getDay()
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })
  
  let busiestDay = 'N/A'
  let maxCount = 0
  Object.entries(dayCounts).forEach(([day, count]) => {
    if (count > maxCount) {
      maxCount = count
      busiestDay = daysOfWeek[day]
    }
  })

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-neutral-900 border-4 border-white w-full max-w-md p-6 sm:p-8 shadow-[10px_10px_0_rgba(255,255,255,0.2)] animate-in zoom-in-95 duration-200 relative">
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <h2 className="font-sans font-black text-2xl uppercase tracking-widest text-white mb-8 border-b-2 border-neutral-700 pb-4">
          Detective Record
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-neutral-800 p-4 border-2 border-neutral-700">
            <p className="text-neutral-400 font-sans text-[10px] font-bold uppercase tracking-widest mb-1">Total Closed</p>
            <p className="font-sans font-black text-3xl text-white">{completedTasks}</p>
          </div>
          <div className="bg-neutral-800 p-4 border-2 border-neutral-700">
            <p className="text-neutral-400 font-sans text-[10px] font-bold uppercase tracking-widest mb-1">Clear Rate</p>
            <p className="font-sans font-black text-3xl text-white">{completionRate}%</p>
          </div>
          <div className="bg-neutral-800 p-4 border-2 border-neutral-700 col-span-2">
            <p className="text-neutral-400 font-sans text-[10px] font-bold uppercase tracking-widest mb-1">Recently Closed (7 Days)</p>
            <p className="font-sans font-black text-4xl text-white">{recentlyCompleted}</p>
          </div>
          <div className="bg-neutral-800 p-4 border-2 border-neutral-700 col-span-2">
            <p className="text-neutral-400 font-sans text-[10px] font-bold uppercase tracking-widest mb-1">Most Active Day</p>
            <p className="font-sans font-black text-2xl text-white">{busiestDay}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
