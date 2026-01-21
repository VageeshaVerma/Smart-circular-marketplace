export default function ServerWarmup() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "#e5e7eb",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>
        🚀 Starting server…
      </h2>
      <p style={{ opacity: 0.8 }}>
        First request may take up to 30 seconds.
      </p>
      <p style={{ marginTop: 12, fontSize: 14, opacity: 0.6 }}>
        Please don’t refresh 🙂
      </p>
    </div>
  );
}
