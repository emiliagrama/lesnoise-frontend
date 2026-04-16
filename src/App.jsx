import { Routes, Route } from "react-router-dom";
import ReviewPage from "./pages/ReviewPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function HomePage() {
  return <div>Markr frontend is running</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/review/:shareToken" element={<ReviewPage />} />
    </Routes>
  );
}