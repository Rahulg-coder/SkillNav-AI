import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LearningModule from "./pages/LearningModule";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Readiness from "./pages/Readiness";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />

            <Route
              path="/skill-gap"
              element={<SkillGap />}
            />

            <Route
              path="/roadmap"
              element={<Roadmap />}
            />
            import LearningModule from "./pages/LearningModule";
            <Route
  path="/learning/:phaseId"
  element={<LearningModule />}
/>
            <Route
              path="/assessment"
              element={<Assessment />}
            />

            <Route
              path="/results"
              element={<Results />}
            />

            <Route
              path="/readiness"
              element={<Readiness />}
            />
            

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;