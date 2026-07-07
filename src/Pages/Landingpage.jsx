import AboutApp from "../components/Landing/AboutApp"
import Action from "../components/Landing/CallAction"
import Footer from "../components/Landing/Footer"
import Hero from "../components/Landing/Hero"
import LandingNavbar from "../components/Landing/Navbar"
import Privacy from "../components/Landing/Privacy"
import Screenshots from "../components/Landing/Screenshots"
import Version from "../components/Landing/Version"
// import "./styles/responsice.css"

const LandingPage= ()=>{
    return(
        <div>
        <LandingNavbar/>
        <Hero/>
        <AboutApp/>
        <Privacy/>
        <Screenshots/>
        <Version/>
        <Action/>
        <Footer/>
    </div>
    )
}

export default LandingPage
// This is where we render everything so tht incase we wanna make changes,it easy to go to the individual pages and make our changes there
// We also wan to make it possible for all of it to be in one scrollable page,so if its adding clickable buttons ,it will be asy to navigate on one page 