'use client'

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0a0a]">
      {/* Repeating Logo Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/logo-pattern.png)',
          backgroundSize: '150px 150px', // Adjust size of repeating logo
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
        }}
      />
      
      {/* Dark vignette gradient to make text readable and blend edges */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none" />
    </div>
  )
}
