import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import SearchUser from "./Pages/SearchUser";
import Vehicles from "./Pages/Vehicles";
import Bookings from "./Pages/Bookings";
import Transcations from "./Pages/Transcations";
import Approvals from "./Pages/Approvals";
import Myprofile from "./Pages/MyProfile";
import SideBar from "./Components/SideBar";
import AdminCard1 from "./Components/AdminCard1";
import CarFormWithPreview from "./Components/CarFormWithPreview";
import Login from "./Pages/Login";
import { AuthProvider } from "./context/AuthContext";
import CarFormWithUpdate from "./Components/CarFormWithUpdate";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MyProfile"
            element={
              <ProtectedRoute>
                <Myprofile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SearchUser"
            element={
              <ProtectedRoute>
                <SearchUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Vehicles"
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Transcations"
            element={
              <ProtectedRoute>
                <Transcations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Approvals"
            element={
              <ProtectedRoute>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/card"
            element={
              <ProtectedRoute>
                <AdminCard1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addcar"
            element={
              <ProtectedRoute>
                <CarFormWithPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-car/:carId"
            element={
              <ProtectedRoute>
                <CarFormWithUpdate />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
