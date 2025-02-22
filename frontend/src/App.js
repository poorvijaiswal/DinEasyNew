import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import About from './pages/About';
import PartnerRestaurant from './pages/PartnerRestaurant';
import ProfilePage from './pages/ProfilePage';
import QRCodeDisplay from "./components/QRCodeDisplay";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import CreateMenu from "./components/CreateMenu";
function App() {
  return (
    <Router>
      <div>
        {/* You can add a Header component here */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/about' element={<About/>} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path="/partners" element={<PartnerRestaurant/>} />
          <Route path="/generate-qr" element={<QRCodeGenerator/>} />
          <Route path="/display-qr" element={<QRCodeDisplay />} />
          <Route path="/createmenu" element={<CreateMenu />} />
         
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;