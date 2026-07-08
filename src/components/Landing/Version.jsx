const Version = () => {
  return(
    <section className="Version-section" style={S.section}>
    <h2 style={S.heading}>🚀 Current release</h2>

    <div style={S.card}>
      <div style={S.versionBadge}>Version v1.0.1</div>
      <h3>Codename:Optimized</h3>

      <p style={S.description}>
        This is the current version of Pesa Wazi improved by your feedback.
      </p>
      <ul style={S.list}>
        <li>✅ Secure user accounts</li>
        <li>✅ Expense tracking</li>
        <li>✅ Budget management</li>
        <li>✅ Monthly reports</li>
        <li>✅ Interactive dashboard</li>
      </ul>
    </div>

  </section>
  )
};

const S = {
  section: {
    padding: "90px 40px",
    background: "#111827",
    color: "white",
    textAlign: "center",
  },

  heading: {
    fontSize:"clamp(2.5rem,5vw,3.3rem)",
    marginBottom: "45px",
  },

  card: {
    maxWidth: "700px",
    margin: "auto",
    background: "#1f2937",
    borderRadius: "18px",
    padding: "40px",
    border: "1px solid #374151",
  },

  versionBadge: {
    display: "inline-block",
    background: "#22c55e",
    color: "white",
    padding: "8px 20px",
    borderRadius: "30px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  description: {
    lineHeight: 1.8,
    color: "#d1d5db",
  },

  list: {
    marginTop: "25px",
    textAlign: "left",
    lineHeight: "2",
  },
};
export default Version;
