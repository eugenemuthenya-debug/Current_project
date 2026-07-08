const AboutApp = () => {
  return (
    <section  className="About-section" style={S.section} id="about">
      <h2 style={S.heading}>What is Pesa Wazi?</h2>

      <p style={S.text}>
        Pesa Wazi is your personal financial management application designed to
        help you understand where your money goes.It allows you to record daily
        expense,create monthly budgets and monitor your spending through simple
        and easy-to-understand visual reports.
      </p>

      <p style={S.text}>
        Whether you are a student, employee, freelancer or small business
        owner,Pesa Wazi gives your a clear picture of your finances so you can
        make better financial decisions with confidence.
      </p>

      <div style={S.cardContainer}>

        {/* card 1 */}
        <div style={S.card} onMouseEnter={(e)=>{
            e.currentTarget.style.transform="translateY(-6px)"
            e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,.35)"
        }}
        onMouseLeave={(e)=>{
            e.currentTarget.style.transform="translateY(0)"
            e.currentTarget.style.boxShadow="none"
        }}>
            <div style={S.icon}>
            📊
        </div>
        <h3>Understand your spending</h3>
        <p>
            View clear reports that show exactly where your money goes.
        </p>
        </div>

        {/* card 2 */}
        <div style={S.card}
        onMouseEnter={(e)=>{
            e.currentTarget.style.transform="translateY(-6px)"
            e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,.35)"
        }}
        onMouseLeave={(e)=>{
            e.currentTarget.style.transform="translateY(0)"
            e.currentTarget.style.boxShadow="none"
        }}>
        <div style={S.icon}>💰</div>
        <h3>Create Monthly Budgets</h3>
        <p>Stay in control by setting realistic monthly spending limits.</p>
      </div>
          
          {/* card 3 */}
      <div style={S.card}
      onMouseEnter={(e)=>{
        e.currentTarget.style.transform="translateY(-6px)"
        e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,.35)"
      }}
      onMouseLeave={(e)=>{
        e.currentTarget.style.transform="translateY(0)"
        e.currentTarget.style.boxShadow="none"
      }}>
        <div style={S.icon}>📈</div>
        <h3>Build Better Habits</h3>
        <p>
            Make smarter financial decisions from your visual reports.
        </p>
      </div>


      </div>
    </section>

    
  );
};

const S = {
  section: {
    padding: "80px 40px",
    background: "#1F2937",
    textAlign: "center",
  },

  heading: {
    fontSize:"clamp(2.5rem,5vw,3.3rem)",
    marginBottom: "25px",
    color: "#ffffff",
  },

  text: {
    maxWidth: "850px",
    margin: "0 auto 20px",
    fontSize:"clamp(1rem,2vw,1.15rem)",
    lineHeight: 1.8,
    color: "#d1d5db",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "60px",
    flexWrap: "wrap",
  },

  card: {
    width: "280px",
    background: "#111827",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    color: "white",
    transition: "0.3s",
    cursor: "pointer",
  },

  icon: {
    fontSize: "42px",
    marginBottom: "20px",
  },
};

export default AboutApp;

// With this page we answered the question tht everyone asks when we present the website to them:
// What is Pesa Wazi
// Who is it for
// What problem does it solve

// when we use e.currentTarget-->we want the whole card to be transformed since in the card we have an icon,a heading and a paragraph
// when we use e.target-->it only animates the exact text it hovers over.So if the mouse is above h3,this is wht will be animated not the whole card same as to the paragraph and the icon.
// transform-->move this element
// translateY(-6px)-->move vertically
// (-6px)=means up
// (6px)=means down

// boxShadow creates the shadow effect underneath the card when the mouse hover over it
// boxShadow="0(horizontal offset=0) 12px(vertical offset)
// 30px(blur) black/rgba(color) 0.35(opacity)"

// is we use setState()=we would need to re render the component every time