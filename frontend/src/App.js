import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import About from './pages/About';
import PartnerRestaurant from './pages/PartnerRestaurant';
import OwnerDashboard from './pages/OwnerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import VerifyEmail from './pages/VerifyEmail';
import MembershipSelection from './pages/MembershipSelection';
import Payment from './pages/Payment';
import StaffLogin from './pages/StaffLogin';
import RestaurantRegister from './pages/RestaurantRegister';


function App() {
  return (
    <Router>
      <div>
        {/* You can add a Header component here */}
       <Header />
        <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/about' element={<About/>} />
          <Route path="/partners" element={<PartnerRestaurant/>} />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/select-membership" element={<MembershipSelection />} />
          <Route path="/payment" element={<Payment />} />
          
          <Route path="/restaurant-register" element={<RestaurantRegister />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
          <Route path="/dashboard/staff" element={<StaffDashboard />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;