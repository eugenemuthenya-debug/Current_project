const Screenshots = () => {
  const previews = [
    {
      title: "Signup",
      Description: "Create your free account",
      image: "/images/Register.png",
    },
    {
      title: "Sign in",
      Description: "Log in if you already have a free acount",
      image: "/images/Signin.png",
    },
    {
      title: "Email Verification",
      Description:
        "During registration enter your exsisting email since a code will be sent to it",
      image: "/images/VerifyEmail.png",
    },
    {
      title: "Add Budget",
      Description: "Set your daily, weekly or monthly budget",
      image: "/images/Addbudget.png",
    },
    {
      title: "Dashboard",
      Description: "View everything on your personal dashboard",
      image: "/images/Dashboard.png",
    },
    {
      title: "Visual Reports",
      Description: "Your expenses as avisal report",
      image: "/images/VisualReports.png",
    },
  ];
  return (
    <section className="Screenshot-section" style={S.section} id="screenshots">
      <h2 style={S.heading}>See Pesa Wazi in Action</h2>

      <p style={S.subtitle}>A quick tour of the tools you'll use .</p>

      <div style={S.previewContainer}>
        {previews.map((item, index) => (
          <div
            key={index}
            style={S.previewCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={S.browserBar}>
              <div style={S.browserDots}>
                <span style={{ ...S.dot, background: "#ef4444" }} />
                <span style={{ ...S.dot, background: "#f59e0b" }} />
                <span style={{ ...S.dot, background: "#22c55e" }} />
              </div>

              <span style={S.browserTitle}>{item.title}</span>
            </div>
            <img
              src={item.image}
              alt={item.title}
              style={S.previewImage}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />

            <h3>{item.title}</h3>
            <p>{item.Description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const S = {
  section: {
    background: "#1f2937",
    padding: "80px 40px",
    color: "white",
    textAlign: "center",
  },

  heading: {
    fontSize: "38px",
    marginBottom: "20px",
  },

  subtitle: {
    maxWidth: "700px",
    margin: "0 auto 60px",
    color: "#d1d5db",
    lineHeight: 1.7,
    fontSize: "18px",
  },
  previewContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "35px",
  },

  previewCard: {
    background: "#111827",
    borderRadius: "18px",
    overflow: "hidden",
    paddingBottom: "25px",
    transition: "0.3s",
    cursor: "pointer",
    border: "1px solid #374151",
  },

  previewImage: {
    width: "100%",
    height: "230px",
    objectFit: "cover",
    marginBottom: "20px",
    transition: "0.3s",
  },

  browserBar: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    background: "#0f172a",
  },

  browserDots: {
    display: "flex",
    gap: "6px",
  },

  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },

  browserTitle: {
    marginLeft: "15px",
    color: "#d1d5db",
    fontSize: "14px",
  },
};

export default Screenshots;
