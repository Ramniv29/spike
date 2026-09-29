'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { toggleTask, addSubtask, toggleSubtask, deleteTask, deleteSubtask, generateSubtasksAI, updateTask } from '@/app/dashboard/actions'
import { ChevronDown, ChevronRight, Plus, Check, Trash2, Target, Sparkles, Loader2, Edit2 } from 'lucide-react'
import { FocusMode } from './FocusMode'
import { playStrikeSound } from '@/lib/sound'

const COLOR_MAP = {
  urgent: 'border-red-600 text-red-600',
  pending: 'border-blue-600 text-blue-600',
  default: 'border-black text-black'
}

export function TaskItem({ task, isSelectionMode, isSelected, onToggleSelect }) {
  const [expanded, setExpanded] = useState(false)
  const [addingSubtask, setAddingSubtask] = useState(false)
  const [isFocusing, setIsFocusing] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [optimisticTask, setOptimisticTask] = useOptimistic(
    task,
    (state, newCompletedStatus) => ({ ...state, is_completed: newCompletedStatus })
  )

  const [optimisticSubtasks, setOptimisticSubtasks] = useOptimistic(
    task.subtasks || [],
    (state, { action, payload }) => {
      if (action === 'toggle') {
        return state.map(st => st.id === payload.id ? { ...st, is_completed: payload.is_completed } : st)
      }
      if (action === 'delete') {
        return state.filter(st => st.id !== payload.id)
      }
      if (action === 'add') {
        return [...state, payload] // optimistic add doesn't have real ID, but it gives immediate feedback
      }
      return state
    }
  )

  const handleToggle = () => {
    if (!optimisticTask.is_completed) playStrikeSound()
    startTransition(async () => {
      setOptimisticTask(!optimisticTask.is_completed)
      await toggleTask(task.id, optimisticTask.is_completed)
    })
  }

  const handleDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    startTransition(async () => {
      // Optimistic update could go here if we expand useOptimistic
      setIsEditing(false)
      await updateTask(task.id, formData)
    })
  }

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true)
    await generateSubtasksAI(task.id, task.title)
    setIsGeneratingAI(false)
    setExpanded(true)
  }

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    startTransition(async () => {
      const title = formData.get('title')
      const colorTag = formData.get('color_tag')
      setOptimisticSubtasks({ action: 'add', payload: { id: Math.random(), title, is_completed: false, color_tag: colorTag } })
      setAddingSubtask(false)
      await addSubtask(formData)
    })
  }

  const handleToggleSubtask = (subtask) => {
    if (!subtask.is_completed) playStrikeSound()
    startTransition(async () => {
      setOptimisticSubtasks({ action: 'toggle', payload: { id: subtask.id, is_completed: !subtask.is_completed } })
      await toggleSubtask(subtask.id, subtask.is_completed)
    })
  }

  const handleDeleteSubtask = (subtask) => {
    if (confirm('Are you sure you want to delete this subtask?')) {
      startTransition(async () => {
        setOptimisticSubtasks({ action: 'delete', payload: { id: subtask.id } })
        await deleteSubtask(subtask.id)
      })
    }
  }

  const colorClass = COLOR_MAP[optimisticTask.color_tag] || COLOR_MAP.default

  if (isEditing) {
    return (
      <div className={`bg-neutral-100/95 backdrop-blur-md border-2 border-black rounded p-4 mb-4 shadow-[4px_4px_0_rgba(255,255,255,0.2)]`}>
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
          <input 
            type="text" 
            name="title" 
            defaultValue={task.title}
            className="w-full bg-transparent border-b-2 border-black text-black text-xl font-bold font-sans py-1 outline-none focus:border-blue-600"
            required
          />
          <textarea 
            name="description" 
            defaultValue={task.description}
            className="w-full bg-black/5 border-2 border-black/10 rounded p-2 text-black text-sm font-sans min-h-[80px] outline-none focus:border-black placeholder-neutral-500"
            placeholder="Description..."
          />
          <div className="flex flex-wrap gap-4 items-center">
            <input 
              type="date" 
              name="deadline" 
              defaultValue={task.deadline ? task.deadline.split('T')[0] : ''}
              className="bg-transparent border-b-2 border-black text-black font-sans font-medium text-sm p-1 outline-none"
            />
            <input 
              type="text" 
              name="category" 
              defaultValue={task.category}
              placeholder="Category"
              className="bg-transparent border-b-2 border-black text-black font-sans font-medium text-sm p-1 outline-none placeholder-neutral-500"
            />
            <select name="color_tag" defaultValue={task.color_tag || 'default'} className="bg-transparent border-b-2 border-black text-black font-sans font-medium text-sm p-1 outline-none">
              <option value="default">Default</option>
              <option value="pending">Pending (Blue)</option>
              <option value="urgent">Urgent (Red)</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold uppercase tracking-wider text-neutral-600 hover:text-black cursor-pointer px-3">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer rounded disabled:opacity-50">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={`bg-neutral-100/95 backdrop-blur-md border-2 ${isSelected ? 'border-neutral-500 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-white/50 shadow-[4px_4px_0_rgba(255,255,255,0.2)]'} rounded overflow-hidden transition-all duration-300 mb-4`}>
      <div 
        className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white transition-colors ${optimisticTask.is_completed ? 'opacity-60 bg-neutral-300/50' : ''} ${isSelected ? 'bg-neutral-200' : ''}`}
        onClick={() => isSelectionMode ? onToggleSelect() : setExpanded(!expanded)}
      >
        {isSelectionMode ? (
          <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-black border-black text-white' : 'border-black bg-transparent'}`}>
            {isSelected && <Check size={16} strokeWidth={3} />}
          </div>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); handleToggle() }}
            className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${optimisticTask.is_completed ? 'bg-black border-black text-white' : `${colorClass} bg-transparent`}`}
          >
            {optimisticTask.is_completed && <Check size={16} strokeWidth={3} />}
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h3 className={`font-sans text-xl font-bold truncate transition-all duration-300 ${optimisticTask.is_completed ? 'strike-line text-neutral-500' : 'text-black'}`}>
            {optimisticTask.title}
          </h3>
          {(optimisticTask.description || optimisticTask.deadline || optimisticTask.category) && (
            <div className="flex gap-3 mt-1 text-xs text-neutral-600 font-sans font-medium uppercase tracking-wider">
              {optimisticTask.category && <span>{optimisticTask.category}</span>}
              {optimisticTask.deadline && <span>Due: {new Date(optimisticTask.deadline).toLocaleDateString()}</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isSelectionMode && (
            <>
              {/* AI breakdown temporarily hidden
              <button 
                onClick={(e) => { e.stopPropagation(); handleGenerateAI() }}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-2 rounded hover:bg-neutral-200"
                title="AI Task Breakdown"
              >
                {isGeneratingAI ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              </button>
              */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true) }}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-2 rounded hover:bg-neutral-200"
                title="Edit Task"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFocusing(true) }}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-2 rounded hover:bg-neutral-200"
                title="Focus Mode"
              >
                <Target size={18} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteTask() }}
                className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-2 rounded hover:bg-red-50"
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
          <button className="text-black hover:text-neutral-600 cursor-pointer p-2">
            {expanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
      </div>

      {expanded && !isSelectionMode && (
        <div className="px-14 pb-5 bg-neutral-200/80 border-t border-black/10">
          {optimisticTask.description && (
            <div className="py-4 text-sm text-neutral-800 font-sans border-b border-black/10 mb-3 space-y-2">
              {optimisticTask.description.split('\n').map((line, i) => {
                // Check if line contains an image URL like [img](url)
                const imgMatch = line.match(/\[img\]\((.*?)\)/i)
                if (imgMatch) {
                  return (
                    <div key={i} className="my-2 border-2 border-black/20 p-1 bg-white/50 w-fit">
                      <img src={imgMatch[1]} alt="Evidence" className="max-h-64 object-contain" />
                    </div>
                  )
                }
                
                // Regular links like [text](url)
                const linkParts = line.split(/(\[.*?\]\(.*?\))/g)
                if (linkParts.length > 1) {
                  return (
                    <p key={i} className="leading-relaxed">
                      {linkParts.map((part, j) => {
                        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
                        if (linkMatch) {
                          return <a key={j} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">{linkMatch[1]}</a>
                        }
                        return <span key={j}>{part}</span>
                      })}
                    </p>
                  )
                }

                return <p key={i} className="leading-relaxed italic">{line}</p>
              })}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-3">
            {optimisticSubtasks.map(subtask => (
              <div key={subtask.id} className={`group flex items-center gap-3 text-sm font-sans font-medium ${subtask.is_completed ? 'opacity-60' : ''}`}>
                <button 
                  onClick={() => handleToggleSubtask(subtask)}
                  className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${subtask.is_completed ? 'bg-black border-black text-white' : 'border-black'}`}
                >
                  {subtask.is_completed && <Check size={14} strokeWidth={3} />}
                </button>
                <span className={`transition-all duration-300 ${subtask.is_completed ? 'strike-line text-neutral-500' : 'text-black'}`}>
                  {subtask.title}
                </span>
                {subtask.color_tag && (
                  <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: subtask.color_tag }}></div>
                )}
                <div className="flex-1"></div>
                <button 
                  onClick={() => handleDeleteSubtask(subtask)}
                  className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100"
                  title="Delete subtask"
                >
                  <Trash2 size={14} />
                </button>
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

      {isFocusing && (
        <FocusMode task={optimisticTask} onClose={() => setIsFocusing(false)} />
      )}
    </div>
  )
}
