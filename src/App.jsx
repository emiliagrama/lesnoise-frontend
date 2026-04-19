import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* owner/admin view */}
      <Route path="/reviews/:id" element={<ReviewPage />} />

      {/* client/share view */}
      <Route path="/review/:shareToken" element={<ReviewPage />} />
    </Routes>
  );
}