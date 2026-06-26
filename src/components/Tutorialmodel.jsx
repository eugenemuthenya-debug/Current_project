import { useState } from "react"

const S ={
    overlay:{
        position:"fixed",
        inset:0,
        background:"rgba(0,0,0,0.7)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex:9999,
    },

    modal:{
        width:"90%",
        maxWidth:"550px",
        background:"#161b27",
        border:"1px solid #1f2535",
        borderRadius:"16px",
        padding:"2rem",
        color:"#e2e8f0",
        textAlign:"center",
        boxShadow:"0 20px 50px rgba(0,0,0,0.4)",
    },

    title:{
        fontSize:"24px",
        fontWeight:"600",
        marginBottom:"1rem",
    },

    text:{
        fontSize:"15px",
        color:"#9ca3af",
        lineHeight:"1.6",
        minHeight:"70px",
    },

    buttons:{
        display:"flex",
        justifyContent:"space-between",
        marginTop:"1.5rem",
    },

    button:{
        padding:"10px 18px",
        border:"none",
        borderRadius:"8px",
        cursor:"pointer",
        background:"#3b82f6",
        color:"white",
        fontWeight:"500",
    },

    secondaryButton:{
        padding:"10px 18px",
        border:"1px solid #2a2d36",
        borderRadius:"8px",
        cursor:"pointer",
        background:"transparent",
        color:"#9ca3af",
    }
}




const Tutorialmodel=({username,onClose})=>{
    // this stores and shows render the current tutorial page tht the new user is on
    const [step,setStep]=useState(1)
    
    // when user cliks next,render knws which page to deploy next
    const nextStep=()=>{
        setStep(step+1)
    }
    const totalSteps=6
    const finishTutorial=()=>{
        localStorage.setItem("hasSeenTutorial","true")
        onClose()
    }
    // now when the user has finished with his tutorial,we store the value in local storage meaning if the user closes the tab and opens it again,the tutorial won't be displayed

    return(
        <div style={S.overlay}>
            <div style={S.modal}>
                {step === 1 &&(
                    <>
                    <h2 style={S.title}>👋 Welocme {username ? `,${username}`:""} ! to your financial Tracker</h2>

                    <p style={S.text}>
                        This application helps you manage your budget, track your expenses,
                        and understand your spending habits with interactive charts and insights. 
                    </p>

                    <button  style={S.button} onClick={nextStep}>Start Tour</button>
                    </>
                )}

                {step === 2 &&(
                    <>
                    <h2 style={S.title}> 💰 Set Your Budget</h2>

                    <p style={S.text}>
                       Create a monthly budget before recording your expenses.

                      As you spend, the dashboard automatically calculates how much you've used and how much remains.
                    </p>

                    <button  style={S.button} onClick={nextStep}>Next</button>
                    </>
                )}

                {step === 3 &&(
                    <>
                    <h2 style={S.title}>
                       📝 Record Every Expense

                    </h2>

                    <p style={S.text}>
                       Add every expense you make—from food and transport to entertainment and bills.

                       The more consistently you record your spending, the more useful your insights become.
                    </p>

                    <button style={S.button} onClick={nextStep}>Next</button>
                    </>
                )}

                {step === 4 &&(
                    <>
                    <h2 style={S.title}>
                        📊 Understand Your Spending
                    </h2>

                    <p  style={S.text}>
                       Use the pie chart to see where your money goes.

                    Use the spending trend chart to monitor your spending throughout the month and spot unusual spending patterns.
                    </p>

                    <button  style={S.button}onClick={nextStep}>Next</button>
                    </>
                )}

                {step === 5 &&(
                    <>
                    <h2 style={S.title}>
                        📈 Monitor Your Progress
                    </h2>


                    <p style={S.text}>
                        Switch between This Month and All Time to compare your spending.

                        Keep an eye on your total spending, remaining budget, recent transactions, and category summaries.
                    </p>

                    <button style={S.button} onClick={nextStep}>Next</button>
                    </>
                )}

                { step === 6 && (
                    <>
                    <h2 style={S.title}>
                        🎉 You're All Set!

                    </h2>

                    <p style={S.text}>
                        You're ready to take control of your finances.

                        Start recording your expenses and watch your financial insights grow over time.

                    </p>

                    <div style={{
                        marginTop:"20px",
                        padding:"15px",
                        background:"#1f2535",
                        borderRadius:"10px",
                        textAlign:"left"
                    }}>
                        <strong>💡 Tip</strong>
                        <p style={{marginTop:"8px", color:"#9ca3af"}}>

                        </p>

                    </div>

                    <p 
                    style={{
                        marginTop:"20px",
                        fontSize:"13px",
                        color:"#6b7280"
                    }}>
                         🚧 This is Version 1.0.

                         Thank you for trying Finance Tracker.
                         Your feedback and suggestions will help shape future updates.
                    </p>

                    <button style={S.button} onClick={finishTutorial}>Go to Dashborad</button>
                    </>
                )}

                <div style={{
                display:"flex",
                justifyContent:"center",
                gap:"8px",
                marginTop:"20px",
                }}>
                    {[1,2,3,4,5,6].map((dot)=>(
                        <div 
                        key={dot}
                        style={{
                            width:"10px",
                            height:"10px",
                            borderRadius:"50%",
                            background:
                            step=== dot
                            ? "#3b82f6"
                            : "#374151", 
                        }}/>
                    ))}
                    <div/>

            </div>
            </div>

            

        </div>

    )
}
// this is a blueprint we are giving react to call after something has happened
// we do not give it closing brackets () since we don't want it to be rendered immediately,but after smthng else
export default Tutorialmodel