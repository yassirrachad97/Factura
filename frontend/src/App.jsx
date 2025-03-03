import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';

import './App.css';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VerifyOtpPage from './pages/VerifyOtpPage';

function App() {
  return (
    <Router>
    

      <Routes>
       
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/:categoryId?" element={<DashboardPage />} />
        <Route path='/verifyOtp' element={<VerifyOtpPage/>} />
      </Routes>
    </Router>
  );
}

export default App;