import React, { Fragment, useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = () => {
  // useHook
  const { isAuthenticated, user } = useSelector((state) => {
    // console.log("state --->", state);
    // console.log("{...state} --->", { ...state });
    return state.auth;
  });
  // console.log(
  //   "🚀 ~ file: Login.js ~ line 10 ~ const{isAuthenticated,user}=useSelector ~ user",
  //   user
  // );

  const dispatch = useDispatch();
  const history = useHistory();
  // console.log(
  //   "🚀 ~ file: Login.js ~ line 12 ~ Login ~ isAuthenticated",
  //   isAuthenticated
  // );
  // const
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // setTimeout(() => {
    dispatch(login(email, password));
    // }, 1000);
    // dispatch(login(email, password));
  };

  // useEffect(() => {}, []);

  // redirect
  // const roleBasedRedirect = async (user) => {
  //   const role = await user.role;
  //   if (role === "admin") {
  //     history.push("/admin/products");
  //   } else {
  //     history.push("/");
  //   }
  // };

  setTimeout(() => {
    if (isAuthenticated && user?.role === "admin") {
      console.log("day la admin");
      // return <Redirect to="/dashboard" />;
      history.push("/dashboard");
    } else if (isAuthenticated) {
      console.log("day la user");
      // return <Redirect to="/dashboardUser" />;
      history.push("/dashboardUser");
    }
  }, 500);

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            // required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            // minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

// Login.propTypes = {
//   login: PropTypes.func.isRequired,
//   // isAuthenticated: PropTypes.bool,
// };

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated,
// });

// export default connect(mapStateToProps, { login })(Login);
// export default connect(null, { login })(Login);
export default Login;
