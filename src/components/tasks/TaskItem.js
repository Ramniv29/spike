'use client'

import { useState } from 'react'
import { toggleTask, addSubtask, toggleSubtask } from '@/app/dashboard/actions'
import { ChevronDown, ChevronRight, Plus, Check } from 'lucide-react'

const COLOR_MAP = {
  urgent: 'border-[var(--color-tag-urgent)] text-[var(--color-tag-urgent)]',
  pending: 'border-[var(--color-tag-pending)] text-[var(--color-tag-pending)]',
  default: 'border-neutral-600 text-neutral-400'
}

export function TaskItem({ task }) {
  const [expanded, setExpanded] = useState(false)
  const [addingSubtask, setAddingSubtask] = useState(false)

  const handleToggle = async () => {
    await toggleTask(task.id, task.is_completed)
  }

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    await addSubtask(formData)
    e.target.reset()
    setAddingSubtask(false)
  }

  const handleToggleSubtask = async (subtask) => {
    await toggleSubtask(subtask.id, subtask.is_completed)
  }

  const colorClass = COLOR_MAP[task.color_tag] || COLOR_MAP.default

  return (
    <div className="bg-[#18181b]/80 backdrop-blur-md border border-neutral-800 rounded-lg overflow-hidden transition-all duration-300">
      <div 
        className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-[#27272a]/50 transition-colors ${task.is_completed ? 'opacity-50' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); handleToggle() }}
          className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${task.is_completed ? 'bg-neutral-600 border-neutral-600 text-white' : `${colorClass} bg-transparent`}`}
        >
          {task.is_completed && <Check size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-sans text-lg font-medium truncate transition-all duration-300 ${task.is_completed ? 'line-through text-neutral-500' : 'text-neutral-100'}`}>
            {task.title}
          </h3>
          {(task.description || task.deadline || task.category) && (
            <div className="flex gap-3 mt-1 text-xs text-neutral-500 font-sans">
              {task.category && <span>{task.category}</span>}
              {task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}
            </div>
          )}
        </div>

        <button className="text-neutral-500 hover:text-neutral-300 cursor-pointer">
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="px-14 pb-4 bg-[#121212]/50 border-t border-neutral-800/50">
          {task.description && (
            <p className="py-3 text-sm text-neutral-400 font-sans border-b border-neutral-800/50 mb-3">
              {task.description}
            </p>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {task.subtasks?.map(subtask => (
              <div key={subtask.id} className={`flex items-center gap-3 text-sm font-sans ${subtask.is_completed ? 'opacity-50' : ''}`}>
                <button 
                  onClick={() => handleToggleSubtask(subtask)}
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${subtask.is_completed ? 'bg-neutral-600 border-neutral-600 text-white' : 'border-neutral-500'}`}
                >
                  {subtask.is_completed && <Check size={10} />}
                </button>
                <span className={`transition-all duration-300 ${subtask.is_completed ? 'line-through text-neutral-500' : 'text-neutral-300'}`}>
                  {subtask.title}
                </span>
                {subtask.color_tag && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subtask.color_tag }}></div>
                )}
              </div>
            ))}

            {addingSubtask ? (
              <form onSubmit={handleAddSubtask} className="mt-3 flex items-center gap-2">
                <input type="hidden" name="task_id" value={task.id} />
                <input 
                  autoFocus
                  name="title" 
                  placeholder="New subtask..." 
                  className="bg-transparent border-b border-neutral-700 text-sm font-sans py-1 outline-none focus:border-neutral-400 flex-1"
                  required
                />
                <input 
                  type="color" 
                  name="color_tag" 
                  className="w-6 h-6 p-0 border-0 bg-transparent rounded cursor-pointer"
                  title="Optional color tag"
                />
                <div className="flex gap-2">
                  <button type="submit" className="text-xs bg-neutral-200 text-neutral-900 px-2 py-1 rounded cursor-pointer">Add</button>
                  <button type="button" onClick={() => setAddingSubtask(false)} className="text-xs text-neutral-400 hover:text-white cursor-pointer">Cancel</button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setAddingSubtask(true)}
                className="mt-2 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 font-sans w-fit transition-colors cursor-pointer"
              >
                <Plus size={14} /> Add subtask
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
