import { useEffect, useState } from 'react'

export default function ThemeToggle({ mounted }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const pref = localStorage.getItem('vcc_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const isDark = pref === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('vcc_theme', next ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} className="px-3 py-1.5 rounded-full border border-white/30 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 shadow-soft text-sm">
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
