import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';

import './App.css';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
    

      <Routes>
       
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;