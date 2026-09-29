'use client'

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
      {/* Repeating Spider-Man Logo Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/logo-pattern.png)',
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) invert(1)',
          opacity: 0.06,
        }}
      />
      
      {/* Subtle vignette on edges only */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)'
      }} />
    </div>
  )
}
