'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({ children, pendingText = 'Processing...', className }) {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-neutral-200 text-neutral-900 font-sans rounded-lg px-4 py-3 mt-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] font-medium tracking-wide ${pending ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} ${className || ''}`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
