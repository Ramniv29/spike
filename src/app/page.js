import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24">
      <div className="z-10 text-center flex flex-col items-center bg-[#121212]/50 p-12 rounded-xl backdrop-blur-sm border border-neutral-800">
        <h1 className="font-cursive text-7xl mb-4 tracking-wider">Strike</h1>
        <p className="font-sans text-neutral-300 italic mb-8 max-w-md text-lg">
          Master your time. Manage your tasks with elegant, immersive productivity.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-neutral-200 text-neutral-900 rounded-md font-sans hover:bg-white transition-colors"
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="px-6 py-3 bg-transparent border border-neutral-600 text-neutral-300 rounded-md font-sans hover:border-neutral-400 hover:text-white transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}
