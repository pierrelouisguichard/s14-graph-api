import React from "react";
import "./PrintCoverPage.css";
import logo from "../assets/logo.png";

const PrintCoverPage = () => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="printable-area">
      <div className="cover-page">
        <img className="logo" src={logo} alt="S14 Capital Logo" />
        <h1 className="title">S14 Capital: New Server Structure</h1>
        <p className="date">{today}</p>
      </div>
    </div>
  );
};

export default PrintCoverPage;
