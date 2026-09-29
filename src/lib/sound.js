'use client'

export function playStrikeSound() {
  if (typeof window === 'undefined') return

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    // Create a "thud" or "stamp" sound
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Pitch envelope (drop pitch rapidly)
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    // Amplitude envelope (sharp attack, quick decay)
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)

    // Add some noise for a "paper" or "stamp" texture
    const bufferSize = ctx.sampleRate * 0.1 // 100ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 1000

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.5, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    noise.start(ctx.currentTime)
  } catch (e) {
    console.error('Audio play failed', e)
  }
}
