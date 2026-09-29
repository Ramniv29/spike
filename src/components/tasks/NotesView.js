'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, FileText, Check, X } from 'lucide-react'
import { addTask, updateTask, deleteTask } from '@/app/dashboard/actions'

export function NotesView({ tasks }) {
  const notes = tasks.filter(t => t.category === '_note')
  
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('category', '_note')
    // Submit
    await addTask(formData)
    setIsCreating(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('category', '_note')
    await updateTask(selectedNote.id, formData)
    setIsEditing(false)
    // locally update the selectedNote reference so it doesn't revert before revalidation
    setSelectedNote({
      ...selectedNote,
      title: formData.get('title'),
      description: formData.get('description')
    })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this note?')) {
      await deleteTask(id)
      if (selectedNote?.id === id) {
        setSelectedNote(null)
        setIsEditing(false)
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[70vh]">
      {/* Sidebar - Note List */}
      <div className="w-full md:w-1/3 bg-neutral-100/95 backdrop-blur-md border-2 border-white/50 shadow-[4px_4px_0_rgba(255,255,255,0.2)] rounded overflow-hidden flex flex-col">
        <div className="p-3 border-b-2 border-black/10 flex justify-between items-center bg-white/50">
          <h3 className="font-sans font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <FileText size={16} /> My Notes
          </h3>
          <button 
            onClick={() => { setIsCreating(true); setSelectedNote(null); setIsEditing(false) }}
            className="p-1 bg-black text-white hover:bg-neutral-800 transition-colors rounded"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
          {notes.length === 0 && !isCreating && (
            <p className="text-center text-xs text-neutral-500 font-sans italic mt-10">No notes yet.</p>
          )}
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => { setSelectedNote(note); setIsEditing(false); setIsCreating(false) }}
              className={`p-3 border-2 cursor-pointer transition-all ${selectedNote?.id === note.id ? 'border-black bg-white shadow-[2px_2px_0_rgba(0,0,0,1)]' : 'border-transparent hover:border-black/20 hover:bg-white/50'}`}
            >
              <h4 className="font-sans font-bold text-sm truncate text-black">{note.title || 'Untitled Note'}</h4>
              <p className="font-sans text-xs text-neutral-500 truncate mt-1">{note.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Note Editor/Viewer */}
      <div className="w-full md:w-2/3 bg-neutral-100/95 backdrop-blur-md border-2 border-white/50 shadow-[4px_4px_0_rgba(255,255,255,0.2)] rounded flex flex-col overflow-hidden">
        {isCreating ? (
          <form onSubmit={handleCreate} className="flex flex-col h-full">
            <div className="p-4 border-b-2 border-black/10 bg-white/50 flex justify-between items-center">
              <input 
                name="title" 
                placeholder="Note Title..." 
                className="bg-transparent border-none text-xl font-bold font-sans outline-none w-full"
                autoFocus
                required
              />
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => setIsCreating(false)} className="p-2 text-neutral-500 hover:text-black">
                  <X size={20} />
                </button>
                <button type="submit" className="p-2 bg-black text-white rounded hover:bg-neutral-800">
                  <Check size={20} />
                </button>
              </div>
            </div>
            <textarea 
              name="description" 
              placeholder="Start writing..." 
              className="flex-1 p-4 bg-transparent border-none font-sans text-sm resize-none outline-none leading-relaxed"
            />
          </form>
        ) : isEditing && selectedNote ? (
          <form onSubmit={handleUpdate} className="flex flex-col h-full">
            <div className="p-4 border-b-2 border-black/10 bg-white/50 flex justify-between items-center">
              <input 
                name="title" 
                defaultValue={selectedNote.title} 
                className="bg-transparent border-none text-xl font-bold font-sans outline-none w-full"
                required
              />
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => setIsEditing(false)} className="p-2 text-neutral-500 hover:text-black">
                  <X size={20} />
                </button>
                <button type="submit" className="p-2 bg-black text-white rounded hover:bg-neutral-800">
                  <Check size={20} />
                </button>
              </div>
            </div>
            <textarea 
              name="description" 
              defaultValue={selectedNote.description} 
              className="flex-1 p-4 bg-transparent border-none font-sans text-sm resize-none outline-none leading-relaxed"
            />
          </form>
        ) : selectedNote ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b-2 border-black/10 bg-white/50 flex justify-between items-center">
              <h2 className="text-xl font-bold font-sans text-black">{selectedNote.title}</h2>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setIsEditing(true)} className="p-2 text-neutral-500 hover:text-black">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => handleDelete(selectedNote.id)} className="p-2 text-neutral-500 hover:text-red-600">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="font-sans text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                {selectedNote.description}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400 font-sans italic text-sm">
            Select a note or create a new one.
          </div>
        )}
      </div>
    </div>
  )
}
