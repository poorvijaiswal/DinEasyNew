import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import About from './pages/About';
import PartnerRestaurant from './pages/PartnerRestaurant';

import ProfilePage from './pages/Dashboard/ProfilePage';
import QRCodeDisplay from "./pages/Dashboard/QRCodeDisplay";
import QRCodeGenerator from "./pages/Dashboard/QRCodeGenerator";
import CreateMenu from "./components/CreateMenu";

import OwnerDashboard from './pages/Dashboard/OwnerDashboard';
import StaffDashboard from './pages/Dashboard/StaffDashboard';
import VerifyEmail from './pages/VerifyEmail';
import MembershipSelection from './pages/MembershipSelection';
import Payment from './pages/Payment';
import StaffLogin from './pages/StaffLogin';
import RestaurantRegister from './pages/RestaurantRegister';
import PrivateRoute from './components/PrivateRoute';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';



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
          {/* <Route path="/dashboard" element={ <Dashboard />} /> */}
          <Route path='/about' element={<About/>} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path="/partners" element={<PartnerRestaurant/>} />

          {/* <Route path="/generate-qr" element={<QRCodeGenerator/>} /> */}
          {/* <Route path="/display-qr" element={<QRCodeDisplay />} /> */}
          {/* <Route path="/createmenu" element={<CreateMenu />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/select-membership" element={<MembershipSelection />} />
          <Route path="/payment" element={<Payment />} />
          
          <Route path="/restaurant-register" element={<RestaurantRegister />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          {/* <Route path="/dashboard/owner" element={<OwnerDashboard />} /> */}
          {/* <Route path="/dashboard/staff" element={<StaffDashboard />} /> */}

            <Route element={<PrivateRoute />}>
              <Route path="/generate-qr" element={<QRCodeGenerator />} />
              <Route path="/display-qr" element={<QRCodeDisplay />} />
              <Route path="/createmenu" element={<CreateMenu />} />
              <Route path="/dashboard/owner" element={<OwnerDashboard />} />
              <Route path="/dashboard/staff" element={<StaffDashboard />} />
            </Route>
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;