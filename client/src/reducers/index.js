import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import activity from "./activity";
// import profile from "./profile";
// import post from "./post";

export default combineReducers({
  alert,
  auth,
  activity,
  //   profile,
  //   post,
});
