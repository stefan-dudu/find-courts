import "./App.css";
import React from "react";
import { useAuth } from "react-oidc-context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About.tsx";
import CourtCheckInPage from "./pages/CourtCheckInPage.tsx";
import Home from "./pages/Home.tsx";
import NavBar from "./Components/NavBar.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";

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
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courts/:id" element={<CourtCheckInPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/instructiuni" element={<HowItWorks />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
