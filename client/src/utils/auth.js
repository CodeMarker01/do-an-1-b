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
