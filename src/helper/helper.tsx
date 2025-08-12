import UtilityAPI from "services/utility";
import axios from "axios";
// import jwt_decode from "jwt-decode";
import { getLocalStorageValue } from "utils/localStorage";
import { LOCALSTORAGE } from "constants/storage.constant";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Make API Requests */

/** To get username from Token */
export async function getUsername() {
  // const token = localStorage.getItem("token");
  const token = getLocalStorageValue(LOCALSTORAGE.MFA_ACCESS_TOKEN);
  if (!token) return Promise.reject("Cannot find Token");
  // let decode = jwt_decode(token);
  return "";
}

/** authenticate function */
export async function authenticate(username: any) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist...!" };
  }
}

/** get User details */
export async function getUser({ username }: any) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't Match...!" };
  }
}

/** register user function */
export async function registerUser(credentials: any) {
  let patientAPI = new UtilityAPI();
  try {
    const response = await patientAPI.userRegister(credentials);

    const {
      data: { msg },
      status,
    } = response || {};
    let { username, email } = credentials;

    /** send email */
    if (status === 201) {
      const response2 = await patientAPI.senMailWithOTP({
        username,
        userEmail: email,
        text: msg,
      });
      console.log(response2);
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** login function */
export async function verifyPassword({ username, password }: any) {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}

/** update user profile function */
export async function updateUser(response: any) {
  try {
    // const token = await localStorage.getItem("token");
    const token = getLocalStorageValue(LOCALSTORAGE.MFA_ACCESS_TOKEN);
    const data = await axios.put("/api/updateuser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}
