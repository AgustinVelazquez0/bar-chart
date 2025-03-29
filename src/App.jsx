// src/App.jsx
import React from "react";
import "./App.css";
import BarChart from "../components/BarChart";

function App() {
  return (
    <div className="App">
      <h1 id="title">Producto Interno Bruto (PIB) de Estados Unidos</h1>
      <BarChart />
    </div>
  );
}

export default App;
