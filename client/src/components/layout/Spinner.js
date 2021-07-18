import React, { Fragment } from "react";
import spinner from "./spinner.gif";
import "./spinner.css";

const Spinner = () => (
  <div className="spinner">
    <img
      src={spinner}
      style={{ width: "200px", margin: "auto", display: "block" }}
      alt="Loading..."
    />
  </div>
);

export default Spinner;
