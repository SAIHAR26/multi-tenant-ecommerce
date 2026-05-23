
function ErrorState({
  title = "Something went wrong",
  message = "Please try again later.",
  actionLabel = "Try Again",
  onAction,
}) {
  return (
    <div
      className="app-state app-state--error"
      role="alert"
    >
      <div className="app-state__error-icon">
        !
      </div>

      <h2>{title}</h2>

      <p>{message}</p>

      {onAction ? (
        <button
          type="button"
          className="customer-secondary-button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;
