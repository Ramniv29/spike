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
    window.addEventListener('openAddTask', handleOpen)
    return () => window.removeEventListener('openAddTask', handleOpen)
  }, [])
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-white text-black border-[3px] border-black rounded-full shadow-[6px_6px_0_rgba(255,255,255,0.4)] flex items-center justify-center hover:bg-neutral-200 hover:-translate-y-1 transition-all duration-300 z-50 cursor-pointer"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-100 border-4 border-white w-full max-w-md shadow-[10px_10px_0_rgba(255,255,255,0.2)] rounded overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b-2 border-black/10 bg-white/50">
          <h2 className="font-sans font-black text-xl uppercase tracking-widest text-black">New Strike</h2>
          <button onClick={() => setIsOpen(false)} className="text-black hover:text-neutral-500 transition-colors cursor-pointer p-1">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        <form action={async (formData) => {
          await addTask(formData)
          setIsOpen(false)
          setTaskType('task')
        }} className="p-6 flex flex-col gap-6">
          
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
              className="bg-transparent border-b-2 border-neutral-400 py-2 outline-none focus:border-black font-sans font-bold text-xl text-black transition-colors placeholder:text-neutral-400"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-600 font-sans font-bold uppercase tracking-wider">Description (Optional)</label>
            <textarea 
              name="description"
              placeholder="Add more details..."
              rows={3}
              className="bg-white border-2 border-neutral-300 rounded p-3 outline-none focus:border-black font-sans text-sm font-medium text-black resize-none transition-colors placeholder:text-neutral-400"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-600 font-sans font-bold uppercase tracking-wider">Category</label>
              <input 
                name="category"
                placeholder="e.g. Work, Personal"
                className="bg-white border-2 border-neutral-300 rounded p-2 outline-none focus:border-black font-sans text-sm font-medium text-black transition-colors placeholder:text-neutral-400"
              />
            </div>
            
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-600 font-sans font-bold uppercase tracking-wider">Deadline</label>
              <input 
                type="datetime-local"
                name="deadline"
                defaultValue={initialDate}
                className="bg-white border-2 border-neutral-300 rounded p-2 outline-none focus:border-black font-sans text-sm font-medium text-black transition-colors [color-scheme:light]"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-4 items-center">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="text-sm font-sans font-bold uppercase tracking-widest text-neutral-600 hover:text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 text-sm font-sans font-bold uppercase tracking-widest bg-black text-white rounded border-2 border-black hover:bg-neutral-800 transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.3)] cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
