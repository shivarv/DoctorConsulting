interface ErrorStateProps {
  title?: string
  message: string
}

export function ErrorState({ title = 'Something went wrong', message }: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <h2 className="state__title">{title}</h2>
      <p className="state__message">{message}</p>
      <button type="button" className="button" onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  )
}
