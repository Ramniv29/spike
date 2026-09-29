'use client'

import { useState, useEffect } from 'react'
import { X, Play, Pause, RotateCcw } from 'lucide-react'

export function FocusMode({ task, onClose }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus' or 'break'

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      // Play a sound here ideally
      if (mode === 'focus') {
        setMode('break')
        setTimeLeft(5 * 60) // 5 minute break
      } else {
        setMode('focus')
        setTimeLeft(25 * 60)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, mode])

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsActive(false)
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors p-2"
      >
        <X size={32} />
      </button>

      <div className="text-center max-w-2xl w-full px-6">
        <div className="inline-block bg-white/10 border border-white/20 text-white px-4 py-1.5 font-sans font-black uppercase text-xs tracking-[0.3em] mb-8">
          ◈ {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
        </div>

        <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase text-white leading-tight mb-4 truncate px-4">
          {task.title}
        </h2>
        {task.category && (
          <p className="text-neutral-500 font-sans font-bold uppercase tracking-widest text-sm mb-12">
            Case: {task.category}
          </p>
        )}

        <div className="font-sans font-black text-[6rem] sm:text-[9rem] text-transparent [-webkit-text-stroke:2px_white] leading-none mb-12 tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={toggleTimer}
            className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:bg-neutral-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-20 h-20 bg-transparent text-white border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <RotateCcw size={28} />
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => switchMode('focus')}
            className={`px-6 py-3 font-sans font-bold uppercase tracking-widest text-xs transition-colors border-2 ${mode === 'focus' ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-500 border-neutral-700 hover:text-white hover:border-white/50'}`}
          >
            Deep Work (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-6 py-3 font-sans font-bold uppercase tracking-widest text-xs transition-colors border-2 ${mode === 'break' ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-500 border-neutral-700 hover:text-white hover:border-white/50'}`}
          >
            Short Break (5m)
          </button>
        </div>
      </div>
    </div>
  )
}
