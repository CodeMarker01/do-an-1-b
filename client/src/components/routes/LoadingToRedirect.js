import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./loadingToRedirect.scss";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5);
  let history = useHistory();
  console.log("run lodingToRedirect");

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 && history.push("/");
    // cleanup
    return () => clearInterval(interval);
  }, [count, history]);

  return (
    <div className="loadingToRedirect container p-5 text-center">
      <h3>You do not have permission to enter this page</h3>
      <p>Redirecting you in {count} seconds</p>
    </div>
  );
};

export default LoadingToRedirect;
