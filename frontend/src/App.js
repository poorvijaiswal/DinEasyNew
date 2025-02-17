import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import About from './pages/About';
import Profile from './pages/Profile';
import PartnerRestaurant from './pages/PartnerRestaurant';

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
          <Route path='/profile' element={<Profile/>} />
          <Route path="/partners" element={<PartnerRestaurant/>} />
          <Route path='' />
        </Routes>
      </div>
    </Router>
  );
}

export default App;