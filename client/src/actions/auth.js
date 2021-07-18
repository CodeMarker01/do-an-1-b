import { useHistory, Redirect } from "react-router-dom";
import api from "../utils/api";
import { LoadActivityUserData, loadActivityUserWeek } from "./activity";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  DATA_TABLE_LOADED,
} from "./types";

// const history = useHistory()
//redirect
// const roleBasedRedirect = (user) => {
//   if (user.role === "admin") {
//     history.push("/admin/products");
//   } else {
//     history.push("/");
//   }
// };

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/create-users", formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      // outside we use connect from redux
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  try {
    const res = await api.post("/auth", body);
    console.log("🚀 ~ file: auth.js ~ line 59 ~ login ~ res", res);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    // dispatch({ type: "TEST_CHUT" });
    // load user info
    dispatch(loadUser());
    //load table data (user name + activity)
    // if (await res.data.user) {
    //   console.log("res.data.user", res.data.user);
    //   if ((await res.data.user.role) === "admin") {
    //     console.log("res.data.user.role admin", res.data.user.role);
    dispatch(LoadActivityUserData());
    // } else if ((await res.data.user.role) === "subscriber") {
    // console.log("res.data.user.role user", res.data.user.role);
    dispatch(loadActivityUserWeek());
    // }
    // }
    // redirect
    // if (res.data.isAuthenticated) {
    //   if (res.data.user.role === "admin") {
    //     return "admin";
    //   } else {
    //     return "subscriber";
    //   }
    // }
  } catch (err) {
    const errors = err.response?.data?.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => ({ type: LOGOUT });

// Get user within a week
export const loadNewUserWeek = async () =>
  await api.get("/user/new-employees/week");
