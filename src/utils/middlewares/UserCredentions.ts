export function getUserDataFromLocalStorage() {
  try {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
}
