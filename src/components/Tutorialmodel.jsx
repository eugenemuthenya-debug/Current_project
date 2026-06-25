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
const Tutorialmodel=({onClose})=>{
    // this stores and shows render the current tutorial page tht the new user is on
    const [step,setStep]=useState(1)
    // when user cliks next,render knws which page to deploy next
    const nextStep=()=>{
        setStep(step+1)
    }
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
                    <h2 style={S.title}>👋 Welocme ,{} to your financial Tracker</h2>

                    <p style={S.text}>
                        This application helps you manage your budget and track expenses. 
                    </p>

                    <button  style={S.button} onClick={nextStep}>Start Tour</button>
                    </>
                )}

                {step === 2 &&(
                    <>
                    <h2> 💰 Budgets</h2>

                    <p>
                        Set a budget before recording expense.It could be daily,weekly,monthly or even yearly.
                    </p>

                    <button  style={S.button} onClick={nextStep}>Next</button>
                    </>
                )}

                {step === 3 &&(
                    <>
                    <h2>
                        📝 Expenses

                    </h2>

                    <p>
                        Record your expenses to keep track of your spending habits 

                    </p>

                    <button style={S.button} onClick={nextStep}>Next</button>
                    </>
                )}

                {step === 4 &&(
                    <>
                    <h2>
                        📊 Dashboard
                    </h2>

                    <p>
                        View summaries and monitor your financial progress. 
                    </p>

                    <button  style={S.button}onClick={finishTutorial}>Finihs</button>
                    </>
                )}
            </div>

            <div>

            </div>

        </div>

    )
}
// this is a blueprint we are giving react to call after something has happened
// we do not give it closing brackets () since we don't want it to be rendered immediately,but after smthng else
export default Tutorialmodel