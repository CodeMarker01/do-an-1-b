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

// get 1 user and activity in current month
export const loadActivityUserMonth = async () =>
  await api.get("/user/check-in-out/month");

// get 1 user and activity in all time for user route
export const loadActivityUserAllTime = async () =>
  await api.get("/user/check-in-out/all-time");

// get 1 user and activity in current month
export const loadAdminLookForActivityUserMonth = async (userId) =>
  await api.get(`/admin/user/check-in-out/month/${userId}`);

// get 1 user and activity in current month
export const loadAdminExportAllDataUser = async (userId) =>
  await api.get(`/admin/exportData/${userId}`);

// get all user and activity in current week
export const loadActivityAdminWeek = async () =>
  await api.get("/all/check-in-out/week");

// get all user and activity on today
export const loadActivityAdminDay = async () =>
  await api.get("/all/check-in-out/day");

// get all user and activity in current month
export const loadActivityAdminMonth = async () =>
  await api.get("/all/check-in-out/month");
