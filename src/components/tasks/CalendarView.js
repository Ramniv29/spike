'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

export function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get starting day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const openAddTaskForDate = (day) => {
    // Format to YYYY-MM-DDT09:00
    const d = new Date(year, month, day, 9, 0)
    
    // Create local timezone aware ISO string for datetime-local input
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d - tzOffset)).toISOString().slice(0, 16);

    window.dispatchEvent(new CustomEvent('openAddTask', { detail: { date: localISOTime } }))
  }

  // Generate blank cells for days before the 1st
  const blanks = Array(firstDay).fill(null)
  
  // Generate actual days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Map tasks to days
  const tasksByDay = {}
  tasks.forEach(task => {
    if (task.deadline && !task.is_completed) {
      const taskDate = new Date(task.deadline)
      if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
        const day = taskDate.getDate()
        if (!tasksByDay[day]) tasksByDay[day] = []
        tasksByDay[day].push(task)
      }
    }
  })

  return (
    <div className="bg-neutral-100/95 backdrop-blur-md border-4 border-white/50 rounded p-6 shadow-[10px_10px_0_rgba(255,255,255,0.2)]">
      
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-sans font-black text-3xl uppercase tracking-widest text-black">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 bg-white border-2 border-black hover:bg-neutral-200 transition-colors shadow-[2px_2px_0_rgba(0,0,0,1)] text-black">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <button onClick={nextMonth} className="p-2 bg-white border-2 border-black hover:bg-neutral-200 transition-colors shadow-[2px_2px_0_rgba(0,0,0,1)] text-black">
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-sans font-bold uppercase tracking-wider text-xs text-neutral-500 py-2 border-b-2 border-black/20">
            {day}
          </div>
        ))}

        {/* Blank Cells */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[100px] p-2 bg-neutral-200/50 border-2 border-transparent"></div>
        ))}

        {/* Day Cells */}
        {days.map(day => {
          const dayTasks = tasksByDay[day] || []
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year

          return (
            <div 
              key={day} 
              onClick={() => openAddTaskForDate(day)}
              className={`min-h-[100px] p-2 border-2 transition-all cursor-pointer group hover:bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,1)] ${isToday ? 'border-black bg-white' : 'border-neutral-300 bg-neutral-50 hover:border-black'}`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-sans font-black text-lg ${isToday ? 'text-black' : 'text-neutral-700'}`}>
                  {day}
                </span>
                <button className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-black transition-opacity">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              <div className="mt-2 flex flex-col gap-1">
                {dayTasks.map(task => {
                  const time = new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  const color = task.color_tag === 'urgent' ? 'bg-red-600' : task.color_tag === 'pending' ? 'bg-blue-600' : 'bg-black'
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-white px-1.5 py-1 flex items-center gap-1 truncate ${color}`}
                      title={`${task.title} at ${time}`}
                    >
                      <Clock size={10} className="shrink-0" />
                      <span className="truncate">{task.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
