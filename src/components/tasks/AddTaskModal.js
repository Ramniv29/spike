'use client'

import { useState } from 'react'
import { addTask } from '@/app/dashboard/actions'
import { Plus, X } from 'lucide-react'

export function AddTaskModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-neutral-200 text-neutral-900 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-300 z-50 cursor-pointer"
      >
        <Plus size={28} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-neutral-800">
          <h2 className="font-sans font-medium text-lg">New Strike</h2>
          <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <form action={async (formData) => {
          await addTask(formData)
          setIsOpen(false)
        }} className="p-4 flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 font-sans">Title</label>
            <input 
              name="title"
              required
              placeholder="What needs to be done?"
              className="bg-transparent border-b border-neutral-700 py-2 outline-none focus:border-white font-sans text-lg transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 font-sans">Description (Optional)</label>
            <textarea 
              name="description"
              placeholder="Add more details..."
              rows={3}
              className="bg-neutral-900 border border-neutral-800 rounded-md p-3 outline-none focus:border-neutral-600 font-sans text-sm resize-none transition-colors"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-400 font-sans">Category</label>
              <input 
                name="category"
                placeholder="e.g. Work, Personal"
                className="bg-neutral-900 border border-neutral-800 rounded-md p-2 outline-none focus:border-neutral-600 font-sans text-sm transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-400 font-sans">Deadline</label>
              <input 
                type="datetime-local"
                name="deadline"
                className="bg-neutral-900 border border-neutral-800 rounded-md p-2 outline-none focus:border-neutral-600 font-sans text-sm transition-colors text-neutral-300 [color-scheme:dark]"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-sans text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 text-sm font-sans bg-neutral-200 text-neutral-900 rounded-md hover:bg-white transition-colors shadow-lg cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
