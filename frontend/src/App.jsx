import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Readiness from "./pages/Readiness";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Main Application */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/readiness" element={<Readiness />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;