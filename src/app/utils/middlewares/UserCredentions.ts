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

export function updateUserDataInLocalStorage(updatedData: any) {
  try {
    localStorage.setItem("user", JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error("Error updating user data in localStorage:", error);
    return false;
  }
}
