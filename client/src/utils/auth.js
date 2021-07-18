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

//remove a product based on products/:slug
export const removeProduct = async (slug, authtoken, productDetail) =>
  await api.delete(`${process.env.REACT_APP_API}/product/${slug}`, {
    headers: {
      authtoken,
    },
    // data: {
    //   source: productDetail,
    // },
  });

//get one product
export const getCurrentUser = async (userId, date) =>
  await api.get(
    `${process.env.REACT_APP_API}/user/activity?userId=${userId}&date=${date}`
  );

//update 1 activity
export const updateUser = async (userId, activityObj) => {
  return await api.put(`${process.env.REACT_APP_API}/user/${userId}`, {
    activityObj,
  });
};

//delete 1 user and all activity
export const removeUser = async (name) =>
  await api.post("/user/delete", { name });
