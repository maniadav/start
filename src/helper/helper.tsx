import UtilityAPI from "@services/start.utility";
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}