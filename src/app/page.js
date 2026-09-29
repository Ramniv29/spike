'use client'

import { Mail } from 'lucide-react'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Background from '@/components/3d/Background'
import { CheckSquare, Calendar, Zap, Target, Shield, ArrowDown, ChevronRight } from 'lucide-react'

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView(0.15)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    desc: 'Create, organise, and complete tasks with subtasks. Strike them off when done — just like crossing off a case file.',
    tag: 'CORE FEATURE',
  },
  {
    icon: Calendar,
    title: 'Calendar View',
    desc: 'See all your deadlines at a glance on a monthly calendar. Know exactly what day your mission is due.',
    tag: 'PLANNING',
  },
  {
    icon: Zap,
    title: 'Instant Add',
    desc: 'Hit the + button from anywhere to pin a new task to the board. No friction, just action.',
    tag: 'SPEED',
  },
  {
    icon: Target,
    title: 'Priority Tags',
    desc: 'Tasks auto-tag as Urgent, Pending, or Default based on deadlines. Always know what needs attention first.',
    tag: 'SMART',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is yours alone. Authentication via Supabase ensures every case file stays locked.',
    tag: 'SECURITY',
  },
]

const useCases = [
  { emoji: '🎓', title: 'Students', desc: 'Track assignments, exam prep, and project deadlines. Never miss a submission.' },
  { emoji: '💼', title: 'Professionals', desc: 'Organise work sprints, meetings, and goals. Your command centre for the grind.' },
  { emoji: '🚀', title: 'Founders', desc: 'Map out feature launches, track bugs, and keep the whole vision in one noir board.' },
  { emoji: '🎨', title: 'Creatives', desc: 'Pin ideas, track commissions, and schedule creative sessions without losing momentum.' },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Background />

      {/* Sticky Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-neutral-800 py-3' : 'py-5'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 flex justify-between items-center">
          <div className="font-cursive text-3xl sm:text-4xl tracking-widest text-white drop-shadow-md">Strike</div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="px-4 py-2 text-neutral-300 font-sans font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-white text-black font-sans font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors shadow-[3px_3px_0px_rgba(255,255,255,0.2)] border-2 border-neutral-800">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">

        {/* ─── HERO SECTION ─── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-24 pb-16 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 font-sans font-black uppercase text-xs tracking-[0.3em] mb-6 animate-pulse">
              ◈ Your Noir Task Manager
            </div>
            <h1 className="font-sans font-black text-5xl sm:text-7xl md:text-8xl uppercase text-white leading-none mb-6 tracking-tight drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Organize<br/>
              <span className="text-transparent [-webkit-text-stroke:2px_white]">The Chaos.</span>
            </h1>
            <p className="text-neutral-300 font-sans text-base sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
              Strike is a high-contrast, noir-style task manager that helps you pin objectives, track deadlines, and close every case — with style.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="group px-8 py-4 bg-white text-black font-sans font-black tracking-widest uppercase text-sm border-2 border-white hover:bg-neutral-200 transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2">
                Open a Case File <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="px-8 py-4 bg-transparent text-white font-sans font-black tracking-widest uppercase text-sm border-2 border-neutral-600 hover:border-white transition-all flex items-center justify-center gap-2">
                Resume Investigation
              </Link>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500 animate-bounce">
            <span className="font-sans text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown size={16} />
          </div>
        </section>

        {/* ─── WHAT IS STRIKE ─── */}
        <section className="py-20 sm:py-32 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="bg-neutral-200 border-4 border-white/10 shadow-[8px_8px_0px_rgba(0,0,0,0.8)] p-8 sm:p-14 w-full transform -rotate-[0.5deg]">
                <div className="absolute -top-4 left-12 w-28 h-7 bg-white/30 rotate-1 border border-white/20"></div>
                <div className="mb-4 inline-block bg-black text-white px-3 py-1 font-sans font-black uppercase text-xs tracking-[0.3em]">Case Brief</div>
                <h2 className="font-sans font-black text-4xl sm:text-6xl uppercase text-black leading-none mb-6 tracking-tight">
                  What is<br/>Strike?
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
                  <p className="font-sans text-neutral-800 font-medium text-base sm:text-lg leading-relaxed border-l-4 border-black pl-5">
                    Strike is a task management web app built with a raw, noir comic aesthetic. Think Spider-Man Noir meets productivity. Dark backgrounds, paper-clipped case files, stark typography.
                  </p>
                  <p className="font-sans text-neutral-700 font-medium text-sm sm:text-base leading-relaxed">
                    Built for people who are serious about getting things done without the fluff. Every task is a mission. Every deadline is a target. You are the detective of your own workflow.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 font-sans font-black uppercase text-xs tracking-[0.3em] mb-4">
                ◈ Features
              </div>
              <h2 className="font-sans font-black text-4xl sm:text-6xl uppercase text-white leading-none tracking-tight">
                Your Arsenal
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((f, i) => (
                <AnimatedSection key={f.title} delay={i * 80}>
                  <div className="group bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-800 hover:border-white/40 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.07)] h-full">
                    <div className="text-xs font-sans font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">{f.tag}</div>
                    <f.icon size={28} className="text-white mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <h3 className="font-sans font-black text-xl uppercase text-white mb-3 tracking-wide">{f.title}</h3>
                    <p className="font-sans text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-neutral-950/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <div className="inline-block bg-white/10 border border-white/20 text-white px-4 py-1.5 font-sans font-black uppercase text-xs tracking-[0.3em] mb-4">
                ◈ How It Works
              </div>
              <h2 className="font-sans font-black text-4xl sm:text-6xl uppercase text-white leading-none tracking-tight">
                Simple as a<br/>Stakeout
              </h2>
            </AnimatedSection>

            <div className="flex flex-col gap-0">
              {[
                { step: '01', title: 'Create Your Account', desc: 'Sign up in seconds. Your personal case board is ready instantly. No subscriptions, no credit card.' },
                { step: '02', title: 'Pin Your Tasks', desc: 'Hit the + button to add tasks. Set deadlines, categories, and descriptions. Tag them as events or to-dos.' },
                { step: '03', title: 'Track on the Board or Calendar', desc: 'Switch between your task list view and the monthly calendar. See urgency at a glance via automatic color tags.' },
                { step: '04', title: 'Strike Them Off', desc: 'Complete tasks, add subtasks as evidence, and bulk delete closed cases. Stay on top of the mission.' },
              ].map((item, i) => (
                <AnimatedSection key={item.step} delay={i * 100}>
                  <div className="flex gap-6 sm:gap-10 items-start py-8 border-b border-neutral-800 group">
                    <div className="font-sans font-black text-5xl sm:text-7xl text-neutral-800 group-hover:text-neutral-600 transition-colors shrink-0 leading-none">{item.step}</div>
                    <div className="pt-1 sm:pt-2">
                      <h3 className="font-sans font-black text-xl sm:text-2xl uppercase text-white mb-2 tracking-wide">{item.title}</h3>
                      <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHO IS IT FOR ─── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <div className="inline-block bg-white/10 border border-white/20 text-white px-4 py-1.5 font-sans font-black uppercase text-xs tracking-[0.3em] mb-4">
                ◈ Built For
              </div>
              <h2 className="font-sans font-black text-4xl sm:text-6xl uppercase text-white leading-none tracking-tight">
                Who Needs Strike?
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {useCases.map((uc, i) => (
                <AnimatedSection key={uc.title} delay={i * 80}>
                  <div className="bg-neutral-200 border-2 border-white/10 shadow-[4px_4px_0px_rgba(0,0,0,0.8)] p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.9)]">
                    <div className="text-4xl mb-4">{uc.emoji}</div>
                    <h3 className="font-sans font-black text-xl sm:text-2xl uppercase text-black mb-3 tracking-wide">{uc.title}</h3>
                    <p className="font-sans text-neutral-700 text-sm sm:text-base leading-relaxed">{uc.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-24 sm:py-36 px-4 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-block bg-black text-white px-4 py-1.5 font-sans font-black uppercase text-xs tracking-[0.3em] mb-8 border-2 border-white/20">
                ◈ Ready, Detective?
              </div>
              <h2 className="font-sans font-black text-5xl sm:text-7xl uppercase text-white leading-none mb-6 tracking-tight">
                Close Every<br/>
                <span className="text-transparent [-webkit-text-stroke:2px_white]">Case.</span>
              </h2>
              <p className="text-neutral-400 font-sans text-base sm:text-lg mb-10 max-w-md mx-auto">
                Free to use. No fuss. Just you, your tasks, and a noir board to pin them all on.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-sans font-black tracking-widest uppercase text-sm border-2 border-white hover:bg-neutral-200 transition-all shadow-[8px_8px_0px_rgba(255,255,255,0.15)] hover:shadow-[12px_12px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1">
                Start For Free <ChevronRight size={18} />
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-neutral-950/60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-block bg-white/10 border border-white/20 text-white px-4 py-1.5 font-sans font-black uppercase text-xs tracking-[0.3em] mb-6">
                ◈ Contact
              </div>
              <h2 className="font-sans font-black text-4xl sm:text-5xl uppercase text-white leading-none mb-4 tracking-tight">
                Got a Question?<br/>
                <span className="text-transparent [-webkit-text-stroke:2px_white]">Drop Us a Line.</span>
              </h2>
              <p className="text-neutral-400 font-sans text-sm sm:text-base mb-10 max-w-md mx-auto">
                Bug reports, feedback, or just want to say hi — we're reachable. Hit us up and we'll get back to you.
              </p>
              <a
                href="mailto:ramniv2529@gmail.com"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white font-sans font-bold uppercase tracking-widest text-sm border-2 border-neutral-700 hover:border-white hover:bg-white hover:text-black transition-all duration-300 shadow-[4px_4px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1"
              >
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                ramniv2529@gmail.com
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-neutral-800 py-8 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-500 font-sans text-xs uppercase tracking-widest">
            <div className="font-cursive text-2xl text-neutral-400 normal-case tracking-widest">Strike</div>
            <span>Built for the grind. © {new Date().getFullYear()}</span>
            <div className="flex gap-6">
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}
