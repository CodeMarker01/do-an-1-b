import {
  LOGOUT,
  RFID_DATA_CANNOT_GET,
  RFID_DATA_LOADED,
  RFID_DATA_UPDATE,
  RFID_FINGERPRINT_APPROVED,
  RFID_FINGERPRINT_DECLINED,
} from "../actions/types";

const initialState = {
  reportList: [],
  loading: true,
  error: {},
};

function rfidOpenDoorReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RFID_DATA_LOADED:
      return {
        ...state,
        reportList: payload,
        loading: false,
      };
    case RFID_DATA_UPDATE:
      return {
        ...state,
        reportList: payload,
        loading: false,
      };
    case RFID_FINGERPRINT_APPROVED:
      return {
        ...state,
        reportList: payload,
        loading: false,
      };
    case RFID_FINGERPRINT_DECLINED:
      return {
        ...state,
        reportList: payload,
        loading: false,
      };
    case RFID_DATA_CANNOT_GET:
    case LOGOUT:
      return {
        ...state,
        reportList: [],
        loading: false,
      };
    default:
      return state;
  }
}

export default rfidOpenDoorReducer;
