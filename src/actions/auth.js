const logout = () => {
  if (localStorage.x_accessToken) {
    localStorage.removeItem("x_accessToken");
    localStorage.removeItem("x_refreshToken");
  }
};
export default {
  logout
};