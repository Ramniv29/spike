'use client'

import { useState } from 'react'
import { toggleTask, addSubtask, toggleSubtask } from '@/app/dashboard/actions'
import { ChevronDown, ChevronRight, Plus, Check } from 'lucide-react'

const COLOR_MAP = {
  urgent: 'border-red-600 text-red-600',
  pending: 'border-blue-600 text-blue-600',
  default: 'border-black text-black'
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
    <div className="bg-neutral-100/95 backdrop-blur-md border-2 border-white/50 rounded shadow-[4px_4px_0_rgba(255,255,255,0.2)] overflow-hidden transition-all duration-300 mb-4">
      <div 
        className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white transition-colors ${task.is_completed ? 'opacity-60 bg-neutral-300/50' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); handleToggle() }}
          className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${task.is_completed ? 'bg-black border-black text-white' : `${colorClass} bg-transparent`}`}
        >
          {task.is_completed && <Check size={16} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-sans text-xl font-bold truncate transition-all duration-300 ${task.is_completed ? 'line-through text-neutral-600' : 'text-black'}`}>
            {task.title}
          </h3>
          {(task.description || task.deadline || task.category) && (
            <div className="flex gap-3 mt-1 text-xs text-neutral-600 font-sans font-medium uppercase tracking-wider">
              {task.category && <span>{task.category}</span>}
              {task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}
            </div>
          )}
        </div>

        <button className="text-black hover:text-neutral-600 cursor-pointer p-1">
          {expanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      {expanded && (
        <div className="px-14 pb-5 bg-neutral-200/80 border-t border-black/10">
          {task.description && (
            <p className="py-4 text-sm text-neutral-800 font-sans border-b border-black/10 mb-3 italic">
              {task.description}
            </p>
          )}

          <div className="flex flex-col gap-3 mt-3">
            {task.subtasks?.map(subtask => (
              <div key={subtask.id} className={`flex items-center gap-3 text-sm font-sans font-medium ${subtask.is_completed ? 'opacity-60' : ''}`}>
                <button 
                  onClick={() => handleToggleSubtask(subtask)}
                  className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${subtask.is_completed ? 'bg-black border-black text-white' : 'border-black'}`}
                >
                  {subtask.is_completed && <Check size={14} strokeWidth={3} />}
                </button>
                <span className={`transition-all duration-300 ${subtask.is_completed ? 'line-through text-neutral-600' : 'text-black'}`}>
                  {subtask.title}
                </span>
                {subtask.color_tag && (
                  <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: subtask.color_tag }}></div>
                )}
              </div>
            ))}

            {addingSubtask ? (
              <form onSubmit={handleAddSubtask} className="mt-4 flex items-center gap-3 bg-white/50 p-2 rounded border border-black/10">
                <input type="hidden" name="task_id" value={task.id} />
                <input 
                  autoFocus
                  name="title" 
                  placeholder="New subtask..." 
                  className="bg-transparent border-b-2 border-neutral-400 text-sm font-sans py-1 font-medium text-black outline-none focus:border-black flex-1"
                  required
                />
                <input 
                  type="color" 
                  name="color_tag" 
                  className="w-8 h-8 p-0 border-2 border-neutral-300 bg-transparent cursor-pointer"
                  title="Optional color tag"
                />
                <div className="flex gap-2">
                  <button type="submit" className="text-xs bg-black text-white font-bold tracking-widest uppercase px-4 py-2 hover:bg-neutral-800 transition-colors cursor-pointer">Add</button>
                  <button type="button" onClick={() => setAddingSubtask(false)} className="text-xs text-black font-bold uppercase hover:text-neutral-600 transition-colors cursor-pointer px-2">Cancel</button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setAddingSubtask(true)}
                className="mt-2 flex items-center gap-2 text-sm text-neutral-600 hover:text-black font-sans font-bold uppercase tracking-wider w-fit transition-colors cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} /> Add Subtask
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
