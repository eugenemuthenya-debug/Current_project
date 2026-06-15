import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import{ BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Addexpense from './components/Addexpense';
import Uploadbudget from './components/Uploadbudget';
import Dashboard from './components/Dashboard';
import Verifyemail from './components/Verifyemail';


function App() {
  return (
    <Router>

      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/addexpense' element={<Addexpense/>}/>
        <Route path='/uploadbudget' element={<Uploadbudget/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/verify_email' element={<Verifyemail/>}/>
      </Routes>
    </Router>
  );
}

export default App;
