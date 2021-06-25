import api from "./api";

//loginAdmin
export const loginAdmin = async () => {
  return await api.get("/auth-admin");
};
