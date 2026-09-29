'use client'

import { useState } from 'react'
import { TaskItem } from './TaskItem'
import { deleteTasks } from '@/app/dashboard/actions'
import { Trash2, CheckSquare } from 'lucide-react'

export function TaskList({ initialTasks }) {
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

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

      {initialTasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          isSelectionMode={isSelectionMode}
          isSelected={selectedTaskIds.has(task.id)}
          onToggleSelect={() => handleToggleSelect(task.id)}
        />
      ))}
    </div>
  )
}
