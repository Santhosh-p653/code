import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import VoiceInput from "./components/VoiceInput";
import TemplateForm from "./components/TemplateForm";
import Profile from "./components/Profile";
import Schedule from "./components/Schedule";
import Attendance from "./components/Attendance";
import SmartVoiceToTemplateConverter from "./components/SmartVoiceToTemplateConverter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 md:ml-64 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/voice-input" element={
            <AppLayout>
              <VoiceInput />
            </AppLayout>
          } />
          <Route path="/template-form" element={
            <AppLayout>
              <TemplateForm />
            </AppLayout>
          } />
          <Route path="/voice-template" element={
            <AppLayout>
              <SmartVoiceToTemplateConverter />
            </AppLayout>
          } />
          <Route path="/schedule" element={
            <AppLayout>
              <Schedule />
            </AppLayout>
          } />
          <Route path="/attendance" element={
            <AppLayout>
              <Attendance />
            </AppLayout>
          } />
          <Route path="/profile" element={
            <AppLayout>
              <Profile />
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;