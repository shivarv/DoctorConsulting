interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Hello {title}</h1>
        <p className="page__subtitle">This page is a placeholder — content coming soon.</p>
      </header>
    </main>
  )
}
