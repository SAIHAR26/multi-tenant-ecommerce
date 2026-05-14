function Button({ text, className = "", type = "button" }) {
  return (
    <button
      type={type}
      className={className}
      style={{
        padding: "10px 20px",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
}

export default Button;