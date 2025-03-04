import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';

import './App.css';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RequestResetPasswordPage from './pages/RequestResetPasswordPage';

function App() {
  return (
    <Router>
    

      <Routes>
       
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/:categoryId?" element={<DashboardPage />} />
        <Route path='/verifyOtp' element={<VerifyOtpPage/>} />
        <Route path='/reset-password' element={<ResetPasswordPage/>} />
        <Route path="/requestPassword" element={<RequestResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;