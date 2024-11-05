import React from "react";
import SideBar from "./side_bar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './App.css';

function App() {
  return (
    <div>
      <SideBar />
      <div className="home">
        <h1>Home Page</h1>
        <p>Welcome!</p>
      </div>
    </div>
  );
}

export default App;