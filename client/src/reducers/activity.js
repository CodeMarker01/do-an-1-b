const {
  DATA_TABLE_LOADED,
  CURRENT_WEEK_DATA,
  LOGOUT,
} = require("../actions/types");

const initialState = {
  tableData: [],
  currentWeekUserData: [],
  loading: true,
  error: {},
};

function activityReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case DATA_TABLE_LOADED:
      return {
        ...state,
        tableData: payload,
        loading: false,
      };
    case CURRENT_WEEK_DATA:
      return {
        ...state,
        currentWeekUserData: payload,
        loading: false,
      };
    case "CANNOT_GET_DATA":
      return {
        ...state,
        tableData: [],
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        tableData: [],
        currentWeekUserData: [],
        loading: false,
      };
    default:
      return state;
  }
}

export default activityReducer;
