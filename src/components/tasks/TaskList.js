'use client'

import { useState, useEffect } from 'react'
import { TaskItem } from './TaskItem'
import { deleteTasks } from '@/app/dashboard/actions'
import { Trash2, CheckSquare, Search, GripVertical, Plus, Calendar as CalendarIcon, Target, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react'

export function TaskList({ initialTasks }) {
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('pending') // 'pending', 'urgent', 'completed', 'event'
  const [orderedTasks, setOrderedTasks] = useState(initialTasks)
  const [draggedId, setDraggedId] = useState(null)

  useEffect(() => {
    // Re-sync if initialTasks changes from DB
    const savedOrder = JSON.parse(localStorage.getItem('strike_task_order') || '[]')
    if (savedOrder.length > 0) {
      const newOrder = [...initialTasks].sort((a, b) => {
        const indexA = savedOrder.indexOf(a.id)
        const indexB = savedOrder.indexOf(b.id)
        if (indexA === -1 && indexB === -1) return 0
        if (indexA === -1) return 1 // New items go to bottom
        if (indexB === -1) return -1
        return indexA - indexB
      })
      setOrderedTasks(newOrder)
    } else {
      setOrderedTasks(initialTasks)
    }
  }, [initialTasks])

  if (!initialTasks || initialTasks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 font-sans italic">No tasks found. Add your first strike.</p>
      </div>
    )
  }

  const handleToggleSelect = (taskId) => {
    const newSelected = new Set(selectedTaskIds)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTaskIds(newSelected)
  }

  const handleDeleteSelected = async () => {
    if (selectedTaskIds.size === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedTaskIds.size} selected tasks?`)) {
      setIsDeleting(true)
      await deleteTasks(Array.from(selectedTaskIds))
      setSelectedTaskIds(new Set())
      setIsSelectionMode(false)
      setIsDeleting(false)
    }
  }

  const handleDragStart = (e, id) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
    // Small delay to allow the drag image to generate before adding opacity
    setTimeout(() => {
      e.target.classList.add('opacity-50')
    }, 0)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (draggedId === targetId) return

    const newOrder = [...orderedTasks]
    const draggedIndex = newOrder.findIndex(t => t.id === draggedId)
    const targetIndex = newOrder.findIndex(t => t.id === targetId)

    const [draggedItem] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedItem)

    setOrderedTasks(newOrder)
    localStorage.setItem('strike_task_order', JSON.stringify(newOrder.map(t => t.id)))
  }

  const handleDragEnd = (e) => {
    setDraggedId(null)
    e.target.classList.remove('opacity-50')
  }

  const filteredTasks = orderedTasks.filter(task => {
    if (task.category === '_note') return false

    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (!matchesSearch) return false

    if (filter !== 'event' && task.color_tag === 'event') return false
    
    if (filter === 'completed') return task.is_completed
    if (filter === 'pending') return !task.is_completed
    if (filter === 'urgent') return task.color_tag === 'urgent'
    if (filter === 'event') return task.color_tag === 'event'
    
    return true
  })

  const pendingCount = orderedTasks.filter(t => !t.is_completed && t.color_tag !== 'event' && t.category !== '_note').length
  const urgentCount = orderedTasks.filter(t => !t.is_completed && t.color_tag === 'urgent' && t.category !== '_note').length
  const completedCount = orderedTasks.filter(t => t.is_completed && t.category !== '_note').length
  const eventCount = orderedTasks.filter(t => t.color_tag === 'event' && t.category !== '_note').length
  const totalCases = orderedTasks.filter(t => t.category !== '_note').length

  const filterCounts = {
    pending: pendingCount,
    urgent: urgentCount,
    completed: completedCount,
    event: eventCount
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Selection Toolbar */}
      <div className="flex justify-end items-center mb-2">
        {!isSelectionMode ? (
          <button 
            onClick={() => setIsSelectionMode(true)}
            className="flex items-center gap-1 sm:gap-2 text-neutral-400 hover:text-white transition-colors text-xs sm:text-sm font-sans uppercase tracking-widest font-bold"
          >
            <CheckSquare size={14} /> Select
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-sans text-neutral-400 font-bold uppercase tracking-widest">
              {selectedTaskIds.size} Selected
            </span>
            <button 
              onClick={handleDeleteSelected}
              disabled={selectedTaskIds.size === 0 || isDeleting}
              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-sans uppercase tracking-widest font-bold transition-colors ${selectedTaskIds.size > 0 ? 'text-red-500 hover:text-red-400 cursor-pointer' : 'text-neutral-600 cursor-not-allowed'}`}
            >
              <Trash2 size={14} /> Delete
            </button>
            <button 
              onClick={() => {
                setIsSelectionMode(false)
                setSelectedTaskIds(new Set())
              }}
              className="text-neutral-400 hover:text-white transition-colors text-xs sm:text-sm font-sans uppercase tracking-widest font-bold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search cases..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 backdrop-blur-md border-2 border-white/10 text-white placeholder:text-neutral-600 rounded p-2 pl-9 outline-none focus:border-white font-sans text-sm transition-colors"
          />
        </div>
        <div className="flex gap-2 bg-black/40 backdrop-blur-md border-2 border-white/10 p-1 rounded overflow-x-auto no-scrollbar">
          {['pending', 'urgent', 'completed', 'event'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 font-sans font-bold uppercase tracking-widest text-[10px] rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${filter === f ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'text-neutral-500 hover:text-white'}`}
            >
              <span>{f}</span>
              {filterCounts[f] > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${filter === f ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                  {filterCounts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        totalCases === 0 ? (
          <div className="bg-neutral-900/80 backdrop-blur-md border-2 border-white/20 rounded-xl p-6 sm:p-10 shadow-[6px_6px_0_rgba(255,255,255,0.08)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-3 py-1 font-sans font-black uppercase text-[10px] tracking-[0.25em] mb-4 shadow-[2px_2px_0_rgba(255,255,255,0.1)]">
              <ShieldAlert size={13} className="text-white" /> Headquarters Briefing
            </div>
            
            <h3 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white mb-2">
              The Desk is Clear, Detective.
            </h3>
            
            <p className="text-neutral-400 font-sans text-sm max-w-lg mx-auto leading-relaxed mb-6">
              No active case files on your board. Open your first case, schedule an upcoming event, or launch with a starter template below.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openAddTask', { detail: { type: 'task' } }))}
                className="px-6 py-3 bg-white text-black font-sans font-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition-all shadow-[4px_4px_0_rgba(255,255,255,0.2)] border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} /> Open First Case File
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openAddTask', { detail: { type: 'event' } }))}
                className="px-6 py-3 bg-transparent text-white font-sans font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all border-2 border-neutral-700 hover:border-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarIcon size={16} /> Schedule Operation Event
              </button>
            </div>

            {/* Quick Starter Mission Presets */}
            <div className="border-t border-neutral-800/80 pt-6">
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 block mb-3">
                Quick Mission Starters (Click to Deploy)
              </span>
              <div className="grid sm:grid-cols-3 gap-3 text-left">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openAddTask', { 
                    detail: { type: 'task', title: 'Daily Mission: Complete top 3 priorities', category: 'Operations' } 
                  }))}
                  className="p-3.5 bg-neutral-950/70 border border-neutral-800 hover:border-white/50 rounded-lg transition-all hover:-translate-y-0.5 group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase mb-1">
                    <Target size={14} className="text-white group-hover:scale-110 transition-transform" /> Daily Sprint
                  </div>
                  <p className="text-neutral-400 text-xs">Plan and strike off today's top 3 mission objectives.</p>
                </button>

                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openAddTask', { 
                    detail: { type: 'task', title: 'Critical Milestone: Deliver project target', category: 'Milestones' } 
                  }))}
                  className="p-3.5 bg-neutral-950/70 border border-neutral-800 hover:border-white/50 rounded-lg transition-all hover:-translate-y-0.5 group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase mb-1">
                    <Zap size={14} className="text-white group-hover:scale-110 transition-transform" /> Project Milestone
                  </div>
                  <p className="text-neutral-400 text-xs">Anchor deliverables, requirements, and deadlines.</p>
                </button>

                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openAddTask', { 
                    detail: { type: 'event', title: 'Debrief & Tactical Review', category: 'Briefing' } 
                  }))}
                  className="p-3.5 bg-neutral-950/70 border border-neutral-800 hover:border-white/50 rounded-lg transition-all hover:-translate-y-0.5 group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase mb-1">
                    <CalendarIcon size={14} className="text-white group-hover:scale-110 transition-transform" /> Strategy Briefing
                  </div>
                  <p className="text-neutral-400 text-xs">Lock in upcoming review sessions on the calendar.</p>
                </button>
              </div>
            </div>

            {/* Keyboard hotkeys hint */}
            <div className="mt-6 pt-4 border-t border-neutral-800/40 flex flex-wrap justify-center items-center gap-4 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              <span><kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded">N</kbd> New Task</span>
              <span>•</span>
              <span><kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded">C</kbd> Calendar</span>
              <span>•</span>
              <span><kbd className="px-1.5 py-0.5 bg-neutral-800 text-white rounded">/</kbd> Search</span>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800 rounded-xl p-8 text-center shadow-[4px_4px_0_rgba(255,255,255,0.05)]">
            <div className="w-10 h-10 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              {searchQuery ? <Search size={18} /> : <CheckCircle2 size={18} />}
            </div>
            
            <h4 className="font-sans font-bold text-base uppercase tracking-wider text-white mb-1">
              {searchQuery 
                ? `No cases match "${searchQuery}"`
                : filter === 'urgent' 
                  ? "No Urgent Threats Detected"
                  : filter === 'completed' 
                    ? "No Cases Solved Yet" 
                    : filter === 'event'
                      ? "No Events Scheduled"
                      : "No Cases Found"}
            </h4>
            
            <p className="text-neutral-400 font-sans text-xs max-w-md mx-auto mb-5">
              {searchQuery 
                ? "Check for typos or try clearing your search query to see all cases."
                : filter === 'urgent'
                  ? "All high-priority deadlines are under control. Check your pending cases."
                  : filter === 'completed'
                    ? "Strike off pending tasks to archive them in your solved case history."
                    : filter === 'event'
                      ? "Add dates and times to organize meetings and deadlines."
                      : "No tasks are active in this view."}
            </p>

            <div className="flex gap-2 justify-center">
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-white text-black font-sans font-bold uppercase text-xs tracking-wider rounded cursor-pointer hover:bg-neutral-200 transition-colors"
                >
                  Clear Search
                </button>
              ) : filter !== 'pending' ? (
                <button 
                  onClick={() => setFilter('pending')}
                  className="px-4 py-2 bg-white text-black font-sans font-bold uppercase text-xs tracking-wider rounded cursor-pointer hover:bg-neutral-200 transition-colors"
                >
                  View Pending Cases ({pendingCount})
                </button>
              ) : (
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openAddTask', { detail: { type: 'task' } }))}
                  className="px-4 py-2 bg-white text-black font-sans font-bold uppercase text-xs tracking-wider rounded cursor-pointer hover:bg-neutral-200 transition-colors"
                >
                  + Add New Task
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        filteredTasks.map(task => (
          <div
            key={task.id}
            draggable={!isSelectionMode && filter === 'pending'}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, task.id)}
            onDragEnd={handleDragEnd}
            className={`${draggedId === task.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} transition-transform duration-200 cursor-grab active:cursor-grabbing`}
          >
            <TaskItem 
              task={task} 
              isSelectionMode={isSelectionMode}
              isSelected={selectedTaskIds.has(task.id)}
              onToggleSelect={() => handleToggleSelect(task.id)}
            />
          </div>
        ))
      )}
    </div>
  )
}
