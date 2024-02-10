import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './app.css'
import axios from 'axios';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VenuePage from "./pages/VenuePage";
import VenueListPage from "./pages/VenueListPage";
import VenueDetailPage from './pages/VenueDetailPage';  
import Header from "./Header";
import Layout from "./Layout";



axios.defaults.baseURL = process.env.BASE_URL + `:` + process.env.BACKEND_PORT;

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
          <Route path="register" element={<RegisterPage />} />
          <Route path="venue" element={<VenuePage />} />
          <Route path="venue/list" element={<VenueListPage />} />
          <Route path="venue/:bookName" element={<VenueDetailPage />} />

      </Routes>
    </Router>
  );
}

export default App;
