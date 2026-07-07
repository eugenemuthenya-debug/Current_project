const Privacy = () => {
  return (
    <section className="Privacy-section" style={S.section} id="privacy">
      <h2 style={S.heading}>Your Privacy is top priority</h2>

      <p style={S.subtitle}>
        Pesa Wazi is designed to help you manage your finances without accessing
        your bank accounts or mobile money services.
      </p>

      <div style={S.grid}>
        <div
          style={S.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={S.icon}>🔒</div>
          <h3>Secure Accounts</h3>

          <p>
            Your account is protected uisng encrypted passwords and secure email
            authentication. This means only existing emails are used during sign
            up
          </p>
        </div>

        <div
          style={S.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={S.icon}>📱</div>
          <h3>Not connected to Mpesa</h3>

          <p>
            Pesa Wazi doesn't access,withdraw,or interact with your Mpesa,bank
            account ,or mobile wallet.
          </p>
        </div>

        <div
          style={S.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={S.icon}>👤</div>
          <h3>Your Stay in control</h3>

          <p>
            Pesa Wazi only stores the information you choose to record and uses
            it to generate your personal reports and budgets.
          </p>
        </div>

        <div style={S.noticeBox}>
          <h3 style={S.noticeHeading}>
            🛡 Your Financial Data Stays Under Your Contorl
          </h3>

          <p style={S.noticeText}>
            Pesa Wazi does not connect to Mpesa,your bank account,debit card or
            mobile wallet. Every expense you see inside the application is
            entered manually by you.This means no automatic withdrawls,no hidden
            transactions and no access to your financial accounts. An android
            application is currently on the way and for smoother transition,a
            valid phone number is required.Thank you
          </p>
        </div>
      </div>
    </section>
  );
};

const S = {
  section: {
    background: "#111827",
    padding: "80px 40px",
    textAlign: "center",
    color: "white",
  },

  heading: {
    fontSize: "38px",
    marginBottom: "15px",
  },

  subtitle: {
    color: "#cbd5e1",
    maxWidth: "700px",
    margin: "0 auto 50px",
    lineHeight: 1.7,
    fontSize: "18px",
  },

  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  card: {
    width: "300px",
    background: "#1f2937",
    padding: "30px",
    borderRadius: "16px",
    transition: "0.3s",
    cursor: "pointer",
  },

  icon: {
    fontSize: "42px",
    marginBottom: "20px",
  },

  noticeBox: {
    marginTop: "60px",

    maxWidth: "900px",

    marginLeft: "auto",

    marginRight: "auto",

    background: "#0f172a",

    borderLeft: "5px solid #22c55e",

    borderRadius: "12px",

    padding: "30px",

    textAlign: "left",
  },

  noticeHeading: {
    marginBottom: "15px",

    color: "#22c55e",
  },

  noticeText: {
    lineHeight: 1.8,

    color: "#d1d5db",
  },
};
export default Privacy;

// this answers the question how secure and why should people trust it.Thnx to multiple feedback we have added this feature for complete transparency and clarity
