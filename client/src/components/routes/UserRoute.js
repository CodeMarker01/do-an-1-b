import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import Spinner from "../layout/Spinner";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ children, ...rest }) => {
  const { isAuthenticated, loading, token, user } = useSelector(
    (state) => state.auth
  );
  console.log(
    "🚀 ~ file: UserRoute.js ~ line 10 ~ UserRoute ~ isAuthenticated",
    isAuthenticated
  );
  return isAuthenticated ? (
    <Route {...rest} render={() => children} />
  ) : (
    <LoadingToRedirect />
  );
};

// UserRoute.propTypes = {
//   auth: PropTypes.object.isRequired,
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

// export default connect(mapStateToProps)(UserRoute);
export default UserRoute;
