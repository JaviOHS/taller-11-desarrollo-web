import { useEffect } from 'react'

function getParticleConfig(dark) {
  return {
    particles: {
      number: { value: dark ? 30 : 50, density: { enable: true } },
      color: { value: dark ? '#ffffff' : '#6ee7b7' },
      shape: { type: 'circle' },
      opacity: { value: dark ? 0.25 : 0.35, random: true },
      size: { value: 2, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: dark ? '#ffffff' : '#a7f3d0',
        opacity: dark ? 0.12 : 0.2,
        width: 1
      },
      move: { enable: true, speed: dark ? 0.6 : 0.8, direction: 'none', random: true, straight: false }
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false } },
      modes: { grab: { distance: 160, line_linked: { opacity: dark ? 0.18 : 0.3 } } }
    }
  }
}

export function useParticles(containerId, dark, enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window.particlesJS !== 'function') return
    if (window.pJSDom && window.pJSDom.length > 0) {
      window.pJSDom.forEach((p) => p.pJS?.fn?.vendors?.destroypJS?.())
      window.pJSDom = []
    }
    window.particlesJS(containerId, getParticleConfig(dark))
    return () => {
      if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom.forEach((p) => p.pJS?.fn?.vendors?.destroypJS?.())
        window.pJSDom = []
      }
    }
  }, [containerId, dark, enabled])
}
