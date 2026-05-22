function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="app-state app-state--error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button className="customer-secondary-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;
