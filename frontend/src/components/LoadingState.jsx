function LoadingState({
  message = "Loading...",
}) {
  return (
    <div
      className="app-state app-state--loading"
      role="status"
      aria-live="polite"
    >
      <div className="app-state__spinner" />

      <h2>{message}</h2>
    </div>
  );
}

export default LoadingState;