export function getUserDataFromLocalStorage() {
  try {
    const userDataString = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return { ...userData, token: authToken };
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
}
