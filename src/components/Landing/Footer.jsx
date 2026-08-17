import { APP_VERSION } from "../../config/version";

const Footer = () => {
  return (
    <footer className="Footer-section" style={S.footer}>
      <h2 style={S.logo}> Pesa Wazi</h2>
      <p style={S.tagline}>Budget smarter. Spend Wiser. Live Better.</p>

      <div style={S.links}>
        <a href="#about" style={S.link}>
          About
        </a>

        <a href="#privacy" style={S.link}>
          Privacy
        </a>

        <a href="#screenshots" style={S.link}>
          Screenshots
        </a>
      </div>
      <p style={S.version}>Current Version {APP_VERSION} by EugeneM</p>

      <p style={S.copy}>
        © {new Date().getFullYear()} Pesa Wazi. Built with ❤️ in Kenya.
      </p>
    </footer>
  );
};

const S = {
  footer: {
    background: "#0f172a",
    color: "white",
    padding: "60px 20px",
    textAlign: "center",
  },

  logo: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  tagline: {
    color: "#9ca3af",
    marginBottom: "35px",
    fontSize: "17px",
  },

  links: {
    display: "flex",
    justifyContent: "center",
    gap: "35px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  link: {
    color: "#d1d5db",
    textDecoration: "none",
    transition: "0.3s",
  },

  version: {
    color: "#22c55e",
    marginBottom: "12px",
    fontWeight: "600",
  },

  copy: {
    color: "#6b7280",
    fontSize: "14px",
  },
};
export default Footer;
