import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
// import { currentAdmin } from "../../functions/auth";
import { loginAdmin } from "../../utils/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const AdminRoute = ({ children, ...rest }) => {
  //   const { auth } = useSelector((state) => ({ ...state }));
  const {
    auth: { isAuthenticated },
  } = useSelector((state) => ({ ...state }));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loginAdmin()
        .then((res) => {
          console.log("CURRENT ADMIN RES", res);
          setIsAdmin(true);
        })
        .catch((err) => {
          console.log("ADMIN ROUTE ERR", err);
          setIsAdmin(false);
        });
    }
  }, []);

  return isAdmin ? (
    <Route {...rest} render={() => children} />
  ) : (
    <LoadingToRedirect />
  );
};

export default AdminRoute;
