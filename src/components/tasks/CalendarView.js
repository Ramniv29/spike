'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Plus, Calendar, X } from 'lucide-react'
import { TaskItem } from './TaskItem'

export function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))

  const blanks = Array(firstDay).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const tasksByDay = {}
  tasks.forEach(task => {
    if (task.category === '_note') return;
    
    if (task.deadline && !task.is_completed) {
      const taskDate = new Date(task.deadline)
      if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
        const day = taskDate.getDate()
        if (!tasksByDay[day]) tasksByDay[day] = []
        tasksByDay[day].push(task)
      }
    }
  })

  // Sort tasks on each day chronologically
  Object.keys(tasksByDay).forEach(day => {
    tasksByDay[day].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  })

  const openAddTaskForDate = (day, type = 'event') => {
    const dayTasks = tasksByDay[day] || []
    let hour = 9
    let minute = 0

    // If there are already events or tasks on this date, pick an incremental hour (e.g. 10:00, 11:00...)
    if (dayTasks.length > 0) {
      const existingHours = dayTasks
        .filter(t => t.deadline)
        .map(t => new Date(t.deadline).getHours())
      if (existingHours.length > 0) {
        const maxHour = Math.max(...existingHours)
        hour = (maxHour + 1) % 24
      }
    }

    const d = new Date(year, month, day, hour, minute)
    const tzOffset = d.getTimezoneOffset() * 60000
    const localISOTime = (new Date(d - tzOffset)).toISOString().slice(0, 16)
    window.dispatchEvent(new CustomEvent('openAddTask', { detail: { date: localISOTime, type } }))
  }

  const selectedDayTasks = selectedDay ? (tasksByDay[selectedDay] || []) : []

  return (
    <>
      <div className="bg-neutral-100/95 backdrop-blur-md border-4 border-white/50 rounded p-3 sm:p-6 shadow-[4px_4px_0_rgba(255,255,255,0.2)] sm:shadow-[10px_10px_0_rgba(255,255,255,0.2)]">
      
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="font-sans font-black text-xl sm:text-3xl uppercase tracking-widest text-black">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1.5 sm:p-2 bg-white border-2 border-black hover:bg-neutral-200 transition-colors shadow-[2px_2px_0_rgba(0,0,0,1)] text-black">
            <ChevronLeft size={16} strokeWidth={3} className="sm:hidden" />
            <ChevronLeft size={20} strokeWidth={3} className="hidden sm:block" />
          </button>
          <button onClick={nextMonth} className="p-1.5 sm:p-2 bg-white border-2 border-black hover:bg-neutral-200 transition-colors shadow-[2px_2px_0_rgba(0,0,0,1)] text-black">
            <ChevronRight size={16} strokeWidth={3} className="sm:hidden" />
            <ChevronRight size={20} strokeWidth={3} className="hidden sm:block" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Day Headers - short on mobile */}
        {[['S','Sun'], ['M','Mon'], ['T','Tue'], ['W','Wed'], ['T','Thu'], ['F','Fri'], ['S','Sat']].map(([short, full], i) => (
          <div key={full} className="text-center font-sans font-bold uppercase tracking-wider text-[9px] sm:text-xs text-neutral-500 py-1 sm:py-2 border-b-2 border-black/20">
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{full}</span>
          </div>
        ))}

        {/* Blank Cells */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[44px] sm:min-h-[100px] p-1 sm:p-2 bg-neutral-200/50 border-2 border-transparent"></div>
        ))}

        {/* Day Cells */}
        {days.map(day => {
          const dayTasks = tasksByDay[day] || []
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`min-h-[44px] sm:min-h-[100px] p-1 sm:p-2 border-2 transition-all cursor-pointer group hover:-translate-y-0.5 sm:hover:-translate-y-1 ${isToday ? 'border-green-500 bg-green-50/90 shadow-[2px_2px_0_rgba(34,197,94,0.4)] sm:shadow-[4px_4px_0_rgba(34,197,94,0.4)]' : 'border-neutral-300 bg-neutral-50 hover:border-black hover:bg-white hover:shadow-[2px_2px_0_rgba(0,0,0,1)] sm:hover:shadow-[4px_4px_0_rgba(0,0,0,1)]'}`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-sans font-black text-xs sm:text-lg ${isToday ? 'text-green-700' : 'text-neutral-700'}`}>
                  {day}
                </span>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openAddTaskForDate(day, 'event')
                  }}
                  className="hidden sm:block opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-black transition-opacity p-0.5 rounded hover:bg-black/5"
                  title="Add Event on this date"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Only show tasks on sm+ screens, show dot indicators on mobile */}
              <div className="mt-1 sm:mt-2 flex flex-col gap-0.5 sm:gap-1">
                {dayTasks.length > 0 && (
                  <div className="sm:hidden flex gap-0.5 flex-wrap">
                    {dayTasks.map(task => (
                      <div key={task.id} className={`w-1.5 h-1.5 rounded-full ${task.color_tag === 'urgent' ? 'bg-red-600' : task.color_tag === 'event' ? 'bg-black' : 'bg-blue-600'}`} />
                    ))}
                  </div>
                )}
                <div className="hidden sm:flex flex-col gap-1">
                  {dayTasks.slice(0, 3).map(task => {
                    const isEvent = task.color_tag === 'event'
                    const time = new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    const color = task.color_tag === 'urgent' ? 'bg-red-600 text-white' : task.color_tag === 'pending' ? 'bg-blue-600 text-white' : isEvent ? 'bg-white border border-black text-black' : 'bg-black text-white'
                    return (
                      <div
                        key={task.id}
                        className={`text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider px-1.5 py-1 flex items-center gap-1 truncate ${color}`}
                        title={`${task.title} at ${time}`}
                      >
                        {isEvent ? <Calendar size={10} className="shrink-0" /> : <Clock size={10} className="shrink-0" />}
                        <span className="truncate">{task.title}</span>
                      </div>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-neutral-500 pl-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>

      {/* Day Details Modal */}
      {selectedDay !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
          <div 
            className="bg-neutral-100 border-4 border-black rounded shadow-[8px_8px_0_rgba(0,0,0,1)] max-w-xl w-full max-h-[80vh] flex flex-col relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedDay(null)}
              className="absolute top-4 right-4 text-black hover:text-neutral-500 transition-colors z-10"
            >
              <X size={24} strokeWidth={3} />
            </button>
            
            <div className="p-4 sm:p-6 border-b-2 border-black/10 flex justify-between items-center pr-12">
              <h3 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-widest text-black">
                {monthNames[month]} {selectedDay}, {year}
              </h3>
              {selectedDayTasks.length > 0 && (
                <span className="text-xs font-sans font-bold uppercase tracking-wider bg-black/10 px-2 py-1 rounded text-neutral-700">
                  {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {selectedDayTasks.length === 0 ? (
                <p className="text-center text-neutral-500 font-sans italic py-10">No events or tasks on this date.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedDayTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t-2 border-black/10 bg-white/50 flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => {
                  openAddTaskForDate(selectedDay, 'event')
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white font-sans font-bold uppercase tracking-widest text-xs sm:text-sm py-3 rounded hover:bg-neutral-800 transition-colors shadow-[3px_3px_0_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 cursor-pointer"
              >
                <Calendar size={16} strokeWidth={3} /> Add Event
              </button>
              <button 
                onClick={() => {
                  openAddTaskForDate(selectedDay, 'task')
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black border-2 border-black font-sans font-bold uppercase tracking-widest text-xs sm:text-sm py-3 rounded hover:bg-neutral-100 transition-colors shadow-[3px_3px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} /> Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
