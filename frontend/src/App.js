import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register"; // Ensure Register component exists

const App = () => {
  return (
    <div className="dark"> {/* Add 'dark' class here */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* ...existing routes... */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;