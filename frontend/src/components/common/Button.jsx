function Button({ text }) {
  return (
    <button
      style={{
        padding: "10px 20px",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
      }}
    >
      {text}
    </button>
  );
}

export default Button;