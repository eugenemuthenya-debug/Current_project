import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import{ BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Addexpense from './components/Addexpense';
import Uploadbudget from './components/Uploadbudget';
import Dashboard from './components/Dashboard';
import Verifyemail from './components/Verifyemail';
import ProtectedRoute from './components/protectedRoute';




function App() {
  return (
    <Router>

      <Routes>
        {/* <Route path="/" element={<Navigate to="/signup" replace />} /> */}
        <Route path='/' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        

        <Route path='/addexpense' element={
          <ProtectedRoute>
            <Addexpense/>
          </ProtectedRoute>
        }/>

        <Route path='/addbudget' element={
          <ProtectedRoute>
            <Uploadbudget/>
          </ProtectedRoute>
        }/>

        <Route path='/verifyemail' element={
          <Verifyemail/>
        }/>

        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard/>
            </ProtectedRoute>
        }/>

        
        
      </Routes>
    </Router>
  );
}

export default App;
