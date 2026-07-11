import { useEffect, useState } from 'react'

const getInitial = () => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [dark, setDark] = useState(getInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, setDark]
}
