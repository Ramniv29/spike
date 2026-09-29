import { signup } from './actions'
import Link from 'next/link'
import Background from '@/components/3d/Background'

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  const message = params?.message;

  return (
    <>
      <Background />
      <div className="flex-1 flex flex-col w-full px-4 sm:max-w-md justify-center mx-auto min-h-screen z-10">
        <div className="bg-[#121212]/70 backdrop-blur-md border border-neutral-800 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-neutral-500/30 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-neutral-500/30 rounded-bl-2xl"></div>

          <div className="text-center mb-8">
            <h1 className="font-cursive text-6xl mb-2 tracking-wider text-white drop-shadow-md">Sign Up</h1>
            <p className="text-neutral-400 font-sans italic text-sm">Join the elegance of productivity</p>
          </div>

          {message && (
            <div className="bg-red-950/50 border border-red-900 text-red-300 px-4 py-3 rounded-lg text-sm text-center mb-6 font-sans">
              {message}
            </div>
          )}
          
          <form className="flex-1 flex flex-col w-full justify-center gap-5 text-foreground relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wider uppercase text-neutral-400 font-sans" htmlFor="email">
                Email
              </label>
              <input
                className="rounded-lg px-4 py-3 bg-neutral-900/50 border border-neutral-700 font-sans focus:outline-none focus:border-neutral-400 focus:bg-neutral-800 transition-all"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-wider uppercase text-neutral-400 font-sans" htmlFor="password">
                Password
              </label>
              <input
                className="rounded-lg px-4 py-3 bg-neutral-900/50 border border-neutral-700 font-sans focus:outline-none focus:border-neutral-400 focus:bg-neutral-800 transition-all"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              formAction={signup}
              className="bg-neutral-200 text-neutral-900 font-sans rounded-lg px-4 py-3 mt-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer font-medium tracking-wide"
            >
              Create Account
            </button>
            
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-400">
                Already have an account?{" "}
                <Link href="/login" className="text-neutral-200 underline hover:text-white transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
