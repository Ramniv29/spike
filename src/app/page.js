import Link from 'next/link'
import Background from '@/components/3d/Background'

export default function Home() {
  return (
    <>
      <Background />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden z-10">
        
        {/* Top Navigation Bar */}
        <nav className="w-full px-6 py-6 sm:px-12 flex justify-between items-center">
          <div className="font-cursive text-5xl tracking-widest text-white drop-shadow-md">Strike</div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2 bg-neutral-200 text-black font-sans font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.5)] border-2 border-neutral-800"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2 bg-[#121212] text-white font-sans font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.2)] border-2 border-neutral-600 hidden sm:block"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Main Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto">
          
          {/* Main Paper Clipping Card */}
          <div className="bg-neutral-200 p-8 sm:p-12 w-full max-w-3xl transform rotate-1 shadow-[10px_10px_0px_rgba(0,0,0,0.7)] border-4 border-neutral-800 relative">
            
            {/* Tape decorations */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-sm -rotate-2 border border-white/20 shadow-sm"></div>
            <div className="absolute -bottom-4 right-10 w-24 h-8 bg-white/40 backdrop-blur-sm rotate-3 border border-white/20 shadow-sm"></div>

            <div className="mb-4 inline-block bg-black text-white px-3 py-1 font-sans font-black uppercase text-xs tracking-[0.3em]">
              Case File #001
            </div>
            
            <h1 className="font-sans font-black text-5xl sm:text-7xl uppercase text-black leading-none mb-6 tracking-tight">
              Organize <br/> The Chaos.
            </h1>
            
            <div className="space-y-4 mb-10">
              <p className="font-sans text-neutral-800 font-bold text-lg sm:text-xl leading-relaxed border-l-4 border-black pl-4">
                The city is messy. Your tasks shouldn't be. Strike is a high-contrast, no-nonsense task manager built for the daily grind.
              </p>
              <p className="font-sans text-neutral-600 font-medium text-base sm:text-lg pl-5">
                Pin your objectives to the board. Track your progress. Close the case. 
                Experience a productivity app with the grit of a 1930s noir comic.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup" 
                className="group flex-1 text-center px-8 py-4 bg-black text-white font-sans font-black tracking-widest uppercase text-sm border-2 border-black hover:bg-neutral-800 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.3)] relative overflow-hidden"
              >
                <span className="relative z-10">Open New Case</span>
              </Link>
              <Link 
                href="/login" 
                className="flex-1 text-center px-8 py-4 bg-transparent text-black font-sans font-black tracking-widest uppercase text-sm border-2 border-black hover:bg-neutral-300 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.2)]"
              >
                Resume Investigation
              </Link>
            </div>

          </div>
          
        </main>
      </div>
    </>
  )
}
