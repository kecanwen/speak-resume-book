import Resume from './content/resume.mdx'
import { Anchor } from './components/Anchor'
import { Drawer } from './components/Drawer'
import { TopBar } from './components/TopBar'
import { ReaderProvider } from './state/reader'

export function App() {
  return (
    <ReaderProvider>
      <TopBar />
      <main className="shell">
        <div className="page">
          <article className="resume">
            <Resume components={{ Q: Anchor }} />
          </article>
          <footer className="colophon">这是一份可以被追问的简历 · 点击划线句子查看问答</footer>
        </div>
      </main>
      <Drawer />
    </ReaderProvider>
  )
}
