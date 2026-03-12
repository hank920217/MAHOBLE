import Header from './Header.jsx'

function PageLayout({ mode, title, subtitle, children }) {
  return (
    <div className={`app-shell app-shell--${mode}`}>
      <div className="background-orb background-orb--one" />
      <div className="background-orb background-orb--two" />

      <main className="page-frame">
        <Header mode={mode} subtitle={subtitle} title={title} />
        {children}
      </main>
    </div>
  )
}

export default PageLayout
