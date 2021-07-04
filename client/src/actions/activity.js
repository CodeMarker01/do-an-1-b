import api from "../utils/api";
import { AUTH_ERROR, CURRENT_WEEK_DATA, DATA_TABLE_LOADED } from "./types";

// Load Activity data per user
export const LoadActivityUserData = () => async (dispatch) => {
  try {
    const res = await api.get("/user/check-in-out/all");

    dispatch({
      type: DATA_TABLE_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: "CANNOT_GET_DATA",
    });
  }
};

// load activity data in current week per user
// export const loadActivityUserWeek = () => async (dispatch) => {
//   try {
//     const res = await api.get("/user/check-in-out/week");

//     dispatch({
//       type: CURRENT_WEEK_DATA,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: "CANNOT_GET_DATA",
//     });
//   }
// };

//
export const loadActivityUserWeek = async () =>
  await api.get("/user/check-in-out/week");
