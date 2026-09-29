import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen relative overflow-hidden p-6">
      
      {/* Rain Effect overlay (CSS animation) */}
      <div className="absolute inset-0 z-0 pointer-events-none rain-container opacity-50 mix-blend-screen">
        <div className="rain"></div>
      </div>

      <div className="z-10 text-center flex flex-col items-center max-w-3xl mx-auto w-full">
        
        {/* Newspaper / Detective Badge / Noir Frame */}
        <div className="relative border-[6px] border-white p-8 sm:p-14 bg-black/75 backdrop-blur-md shadow-2xl w-full before:absolute before:inset-2 before:border before:border-white/30 after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-white after:text-black after:px-6 after:py-2 after:font-bold after:font-sans after:tracking-[0.4em] after:uppercase after:text-xs">
          
          <style dangerouslySetInnerHTML={{__html: `
            .after\\:content-\\[\\'DAILY_BUGLE\\'\\]::after {
              content: 'THE DAILY STRIKE';
            }
            @keyframes flicker {
              0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
                opacity: 1;
                text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #a1a1aa;
              }
              20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
                opacity: 0.4;
                text-shadow: none;
              }
            }
            .animate-flicker {
              animation: flicker 4s infinite alternate;
            }
          `}} />
          
          <div className="after:content-['DAILY_BUGLE'] absolute inset-0 pointer-events-none"></div>

          <h1 className="font-cursive text-7xl sm:text-[9rem] mb-6 tracking-widest text-white animate-flicker mix-blend-screen leading-none">
            Strike
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
            <div className="h-[2px] w-12 sm:w-24 bg-white"></div>
            <p className="font-sans font-black tracking-[0.3em] text-xs sm:text-sm uppercase text-white">1933 Edition</p>
            <div className="h-[2px] w-12 sm:w-24 bg-white"></div>
          </div>
          
          <div className="bg-white/10 p-6 sm:p-8 border-l-4 border-white mb-10 text-left">
            <p className="font-sans text-neutral-200 italic text-lg sm:text-xl leading-relaxed">
              "The city's tough. It never sleeps, and neither do your responsibilities. 
              Step out of the shadows and take control of your time like a true detective."
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/login" 
              className="group relative px-8 py-4 bg-white text-black font-bold font-sans tracking-widest uppercase text-sm overflow-hidden border-2 border-white w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-neutral-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Step Into The Light</span>
                <span className="opacity-50">(Log In)</span>
              </span>
            </Link>
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold font-sans tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-colors w-full sm:w-auto"
            >
              Join The Force
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
