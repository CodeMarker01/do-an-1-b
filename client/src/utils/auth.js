import api from "./api";

//loginAdmin
export const loginAdmin = async () => {
  return await api.get("/auth-admin");
};

// redirect
// const roleBasedRedirect = (user) => {
//   if (user.role === "admin") {
//     history.push("/admin/products");
//   } else {
//     history.push("/");
//   }
// };
