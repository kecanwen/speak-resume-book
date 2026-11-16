import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      setProgress(max > 0 ? Math.min(1, scrollY / max) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return progress
}

export function TopBar() {
  const progress = useScrollProgress()
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme) ?? 'light',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <p className="legend">
          <span className="legend-swatch level-3" />
          <span className="legend-swatch level-2" />
          <span className="legend-swatch level-1" />
          划线越深越常被问到，点击查看追问
        </p>
        <button
          className="icon-btn theme-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? '切换到浅色' : '切换到深色'}
        >
          {theme === 'dark' ? '☼' : '☾'}
        </button>
      </div>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  )
}
