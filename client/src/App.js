import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/Home";

const App = () => {
  return (
    <div class="app">
      <Router>
        <Topbar />
        <div className="container">
          <Sidebar />
          <Home />
        </div>
      </Router>
    </div>
  );
};

export default App;
