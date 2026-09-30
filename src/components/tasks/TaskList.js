'use client'

import { useState, useEffect } from 'react'
import { TaskItem } from './TaskItem'
import { deleteTasks } from '@/app/dashboard/actions'
import { Trash2, CheckSquare, Search, GripVertical } from 'lucide-react'

export function TaskList({ initialTasks }) {
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'urgent', 'completed'
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

    if (filter === 'all') return true
    if (filter === 'completed') return task.is_completed
    if (filter === 'pending') return !task.is_completed
    if (filter === 'urgent') return task.color_tag === 'urgent'
    if (filter === 'event') return task.color_tag === 'event'
    
    return true
  })

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
          {['all', 'pending', 'urgent', 'completed', 'event'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 font-sans font-bold uppercase tracking-widest text-[10px] rounded transition-colors whitespace-nowrap ${filter === f ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'text-neutral-500 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-white/10 bg-black/20">
          <p className="text-neutral-500 font-sans italic">No cases match your filters.</p>
        </div>
      ) : (
        filteredTasks.map(task => (
          <div
            key={task.id}
            draggable={!isSelectionMode && filter === 'all'}
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
