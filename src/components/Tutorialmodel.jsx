import { useState } from "react"

const TutorialModel=({onClose})=>{
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
        <div className="tutorial-overlay">
            <div className="tutorial-card">
                {step === 1 &&(
                    <>
                    <h2>👋 Welocme ,{} to your financial Tracker</h2>

                    <p>
                        This application helps you manage your budget and track expenses. 
                    </p>

                    <button onClick={nextStep}>Start Tour</button>
                    </>
                )}

                {step === 2 &&(
                    <>
                    <h2> 💰 Budgets</h2>

                    <p>
                        Set a budget before recording expense.It could be daily,weekly,monthly or even yearly.
                    </p>

                    <button onClick={nextStep}Next></button>
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

                    <button onClick={nextStep}>Next</button>
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

                    <button onClick={finishTutorial}>Finihs</button>
                    </>
                )}
            </div>

        </div>

    )
}
export default TutorialModel()