import { Routes, Route } from "react-router-dom";
import ReviewPage from "./pages/ReviewPage";

function HomePage() {
  return <div>Markr frontend is running</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/review/:shareToken" element={<ReviewPage />} />
    </Routes>
  );
}