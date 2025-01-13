import "./App.css";
import React from "react";
import { useAuth } from "react-oidc-context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About.tsx";
import CourtCheckInPage from "./pages/CourtCheckInPage.tsx";
import Home from "./pages/Home.tsx";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courts/:id" element={<CourtCheckInPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
