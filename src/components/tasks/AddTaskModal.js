'use client'

import { useState, useEffect } from 'react'
import { addTask } from '@/app/dashboard/actions'
import { Plus, X } from 'lucide-react'

export function AddTaskModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [initialDate, setInitialDate] = useState('')
  const [taskType, setTaskType] = useState('task')

  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true)
      if (e.detail?.date) {
        setInitialDate(e.detail.date)
      } else {
        setInitialDate('')
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('openAddTask', handleOpen)
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('openAddTask', handleOpen)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-white text-black border-[3px] border-black rounded-full shadow-[6px_6px_0_rgba(255,255,255,0.4)] flex items-center justify-center hover:bg-neutral-200 hover:-translate-y-1 transition-all duration-300 z-50 cursor-pointer"
      >
        <Plus size={28} strokeWidth={3} className="sm:hidden" />
        <Plus size={32} strokeWidth={3} className="hidden sm:block" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-100 border-4 border-white w-full sm:max-w-md shadow-[10px_10px_0_rgba(255,255,255,0.2)] rounded-t-2xl sm:rounded overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 sm:p-5 border-b-2 border-black/10 bg-white/50">
          <h2 className="font-sans font-black text-lg sm:text-xl uppercase tracking-widest text-black">New Strike</h2>
          <button onClick={() => setIsOpen(false)} className="text-black hover:text-neutral-500 transition-colors cursor-pointer p-1">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        <form action={async (formData) => {
          await addTask(formData)
          setIsOpen(false)
          setTaskType('task')
        }} className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
          
          <input type="hidden" name="type" value={taskType} />

          {/* Type Toggle */}
          <div className="flex bg-neutral-200/50 p-1 rounded border-2 border-black/10">
            <button
              type="button"
              onClick={() => setTaskType('task')}
              className={`flex-1 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-colors ${taskType === 'task' ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)] border-2 border-black' : 'text-neutral-500 hover:text-black'}`}
            >
              To-Do
            </button>
            <button
              type="button"
              onClick={() => setTaskType('event')}
              className={`flex-1 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-colors ${taskType === 'event' ? 'bg-white text-black shadow-[2px_2px_0_rgba(0,0,0,1)] border-2 border-black' : 'text-neutral-500 hover:text-black'}`}
            >
              Event
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-600 font-sans font-bold uppercase tracking-wider">Title</label>
            <input 
              name="title"
              required
              placeholder={taskType === 'event' ? "What's the event?" : "What needs to be done?"}
              className="bg-transparent border-b-2 border-neutral-400 py-2 outline-none focus:border-black font-sans font-bold text-lg sm:text-xl text-black transition-colors placeholder:text-neutral-400"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <label className="text-xs text-neutral-600 font-sans font-bold uppercase tracking-wider">Case File (Notes & Evidence)</label>
              <span className="text-[10px] text-neutral-500 font-sans italic">To attach an image, type: [img](image-url-here)</span>
            </div>
            <textarea 
              name="description"
              placeholder="Add your notes... \n\n[img](https://imgur.com/example.jpg)"
              rows={4}
              className="bg-white border-2 border-neutral-300 rounded p-3 outline-none focus:border-black font-sans text-sm font-medium text-black resize-y transition-colors placeholder:text-neutral-400"
            />
          </div>
          
          {/* Category and Deadline - stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-600 font-sans font-bold uppercase tracking-wider">Category</label>
              <input 
                name="category"
                placeholder="e.g. Work, Personal"
                className="bg-white border-2 border-neutral-300 rounded p-2 outline-none focus:border-black font-sans text-sm font-medium text-black transition-colors placeholder:text-neutral-400"
              />
            </div>
            
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-600 font-sans font-bold uppercase tracking-wider">{taskType === 'event' ? 'Date & Time' : 'Deadline'}</label>
              <input 
                type="datetime-local"
                name="deadline"
                defaultValue={initialDate}
                className="bg-white border-2 border-neutral-300 rounded p-2 outline-none focus:border-black font-sans text-sm font-medium text-black transition-colors [color-scheme:light]"
              />
            </div>
          </div>
          
          <div className="mt-2 flex justify-end gap-4 items-center pb-safe">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="text-sm font-sans font-bold uppercase tracking-widest text-neutral-600 hover:text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 sm:px-8 py-3 text-sm font-sans font-bold uppercase tracking-widest bg-black text-white rounded border-2 border-black hover:bg-neutral-800 transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.3)] cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
