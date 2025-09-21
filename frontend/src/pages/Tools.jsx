import React from "react";
import NotesTool from "../components/tools/NotesTool.jsx";
import UnitConverter from "../components/tools/UnitConverter.jsx";
import TimerTool from "../components/tools/TimerTool.jsx";
import PasswordGenerator from "../components/tools/PasswordGenerator.jsx";
import CurrencyConverter from "../components/tools/CurrencyConverter.jsx";

export default function Tools() {
  return (
    <section id="tools">
      <div className="container">
        <h2>Small tools</h2>
        <div className="tools-grid">
          <NotesTool />
          <UnitConverter />
          <TimerTool />
          <PasswordGenerator />
          <CurrencyConverter />
        </div>
      </div>
    </section>
  );
}