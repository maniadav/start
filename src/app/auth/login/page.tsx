"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { passwordValidator, usernameValidator } from "@helper/validator";
import toast, { Toaster } from "react-hot-toast";
import UtilityAPI from "@services/utility";
import { setLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { API_ENDPOINT } from "@constants/api.constant";
import Link from "next/link";

interface LoginDataType {
  username: string;
  password: string;
}

const LoginPage = () => {
  const [responseBody, setResponseBody] = useState<LoginDataType>({
    username: "",
    password: "",
  });
  const router = useRouter();

  const onSubmitForm = () => {
    const passwordCheckMSG = passwordValidator(responseBody?.password);
    const usernameCheckMSG = usernameValidator(responseBody?.username);
    if (passwordCheckMSG) {
      toast.error(passwordCheckMSG, { duration: 3000 });
    }

    if (usernameCheckMSG) {
      toast.error(usernameCheckMSG, { duration: 3000 });
    }
    if (!passwordCheckMSG && !usernameCheckMSG) {
      const myPromise = loginUserAPI();
      toast.promise(myPromise, {
        loading: "loading...",
        success: "user loined!",
        error: "something went wrong!",
      });
    }
  };

  const loginUserAPI = async () => {
    let psychAPI = new UtilityAPI();
    try {
      const response = await psychAPI.userLogin(responseBody);
      const data = response.data;
      console.error({ response });
      const accessToken = data.accessToken || "";
      const refreshToken = data.refreshToken || "";
      setLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, data.user, true);
      setLocalStorageValue(LOCALSTORAGE.MFA_ACCESS_TOKEN, accessToken);
      setLocalStorageValue(LOCALSTORAGE.MFA_REFRESH_TOKEN, refreshToken);
      router.push("/");
    } catch (error: any) {
      console.error("API call error:", error);
      toast.error("Check your credential or try again later!!");
    }
  };

  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };

  return (
    <div className="overflow-hidden relative w-full h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="z-20 absolute w-full h-full bg-black opacity-60"></div>
      <div
        className="z-10 absolute w-full h-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}
      ></div>
      <div className="absolute w-full h-full flex justify-center items-center align-middle py-10">
        <div className="z-30 relative p-3 sm:max-w-xl sm:mx-auto shadow-lg rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative bg-white shadow-lg rounded-3xl p-20">
            <div className="max-w-md">
              <div>
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>
              <div className="w-full min-w-52 flex flex-col gap-4 py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="username"
                    name="username"
                    type="text"
                    className="text-sm peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="User ID"
                    onChange={(e) => inputChangeHandler(e)}
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    User ID
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="text-sm peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Password"
                    onChange={(e) => inputChangeHandler(e)}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="flex justify-between gap-5">
                  <Link
                    className="text-indigo-700 hover:text-pink-700 text-sm float-left"
                    href={`${API_ENDPOINT.auth.resetPassword}`}
                  >
                    Forgot Password?
                  </Link>
                  <Link
                    className="text-indigo-700 hover:text-pink-700 text-sm float-right"
                    href={`${API_ENDPOINT.auth.register}`}
                  >
                    Create Account
                  </Link>
                </div>
                <div className="">
                  <button
                    className="cursor-pointer w-full bg-gray-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
                    onClick={() => onSubmitForm()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
