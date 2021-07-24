import api from "../utils/api";
import {
  RFID_DATA_CANNOT_GET,
  RFID_DATA_LOADED,
  RFID_DATA_UPDATE,
} from "./types";

//load all report from user
export const loadReportUserData = () => async (dispatch) => {
  const res = await api.get("/admin/report/fingerprint-error");

  dispatch({
    type: RFID_DATA_LOADED,
    payload: res.data,
  });
};

// Add post
export const updateReportUserData = (reportList) => async (dispatch) => {
  const res = await api.put(
    "/admin/report/fingerprint-error/approve-or-decline",
    reportList
  );

  dispatch({
    type: RFID_DATA_UPDATE,
    payload: res.data,
  });

  dispatch(loadReportUserData());

  console.log(res.data);
};
