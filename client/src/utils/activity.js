import api from "./api";

// @route    GET api/user/check-in-out-all
// @desc     Get all user activity closest day with user email & password
// @access   Public (test) / User Only
export const getUserWithActivity = async () => {
  return await api.get("/user/check-in-out/all");
};
