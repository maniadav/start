"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UtilityAPI from "@services/start.utility";
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "helper/validator";
import CommonIcon from "components/common/CommonIcon";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { API_ENDPOINT } from "@constants/api.constant";
import { setLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { BASE_URL } from "@constants/config.constant";

interface FormDataType {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  profile: string;
}
// export const formData: FormDataType = {
//   email: "",
//   username: "",
//   password: "",
//   firstName: "",
//   lastName: "",
//   mobile: "",
//   address: "",
//   profile: "",
// };

const RegisterPage = () => {
  const [file, setFile] = useState<any>(null);
  const [responseBody, setResponseBody] = useState<FormDataType>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    profile: "",
  });
  const router = useRouter();

  const handleFileChange = (e: any) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setResponseBody({ ...responseBody, profile: e.target.files[0] });
  };

  const onSubmitForm = () => {
    if (!file) {
      toast.error("please select profile image!", { duration: 3000 });
      return;
    }
    const passwordCheckMSG = passwordValidator(responseBody?.password);
    const emailCheckMSG = emailValidator(responseBody?.email);
    const usernameCheckMSG = usernameValidator(responseBody?.username);
    if (passwordCheckMSG) {
      toast.error(passwordCheckMSG, { duration: 3000 });
    }
    if (emailCheckMSG) {
      toast.error(emailCheckMSG, { duration: 3000 });
    }
    if (usernameCheckMSG) {
      toast.error(usernameCheckMSG, { duration: 3000 });
    }
    if (!passwordCheckMSG && !emailCheckMSG && !usernameCheckMSG) {
      const myPromise = registerUserAPI();
      toast.promise(myPromise, {
        loading: "loading...",
        success: "reponse success!",
        error: "something went wrong!",
      });
    }
  };

  const registerUserAPI = async () => {
    // const formData = new FormData();
    // formData.append("username", responseBody?.username);
    // formData.append("password", responseBody?.password);
    let psychAPI = new UtilityAPI();
    // console.log({ formData });
    try {
      const response = await psychAPI.userLogin(responseBody);
      const data = response.data;
      const msg = response?.data?.message || "user is registered!";
      toast.success(msg);
      const accessToken = data.accessToken || "";
      const refreshToken = data.refreshToken || "";
      setLocalStorageValue(LOCALSTORAGE.START_USER, data.user, true);
      setLocalStorageValue(LOCALSTORAGE.MFA_ACCESS_TOKEN, accessToken);
      setLocalStorageValue(LOCALSTORAGE.MFA_REFRESH_TOKEN, refreshToken);
      router.push("/");
    } catch (error: any) {
      console.error("API call error:", error);
      toast.error("something went wrong, please check console!");
    }
  };

  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <section className="bg-gray-1 lg:py-20 p-5">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="border-2 border-gray-200 shadow-md mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-8 py-16 text-center-2 md:px-16">
                <div className="mb-4 text-center">
                  <h4 className="mb-2 text-5xl font-bold">Register</h4>
                  <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                    Happy to join you!
                  </span>
                </div>
                <div className="py-4">
                  <div className="relative w-auto h-auto flex justify-center py-4">
                    <label htmlFor="profile">
                      <Image
                        src={file || `${BASE_URL}/image/profile.png`}
                        className="w-28 h-28 rounded-full cursor-pointer border-2 border-gray-400"
                        alt="avatar"
                        width={150}
                        height={150}
                      />
                    </label>
                    <input
                      className="border-dotted absolute top-0 w-full h-full opacity-0 cursor-pointer"
                      type="file"
                      id="profile"
                      name="profile"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-6">
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="username"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Email ID
                      </label>
                      <input
                        id={"email"}
                        name={"email"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="email"
                        placeholder="email*"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="username"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Username
                      </label>
                      <input
                        id={"username"}
                        name={"username"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="username"
                        placeholder="username*"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="username"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                      <input
                        id={"password"}
                        name={"password"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="password"
                        placeholder="Password*"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="firstName"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        First Name
                      </label>
                      <input
                        id={"firstName"}
                        name={"firstName"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="text"
                        placeholder="firstName*"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="username"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                      <input
                        id={"password"}
                        name={"password"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="password"
                        placeholder="Password*"
                      />
                    </div>{" "}
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="username"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                      <input
                        id={"password"}
                        name={"password"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="password"
                        placeholder="Password*"
                      />
                    </div>{" "}
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="username"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                      <input
                        id={"password"}
                        name={"password"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="password"
                        placeholder="Password*"
                      />
                    </div>{" "}
                    <div className="flex flex-col w-full gap-1">
                      <label
                        htmlFor="username"
                        className="left-0 -top-5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                      <input
                        id={"password"}
                        name={"password"}
                        onChange={(e) => inputChangeHandler(e)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none "
                        type="password"
                        placeholder="Password*"
                      />
                    </div>
                    <button
                      onClick={onSubmitForm}
                      className="flex flex-row items-center gap-3 py-2.5 px-10 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      <CommonIcon
                        icon="heroicons-outline:user-add"
                        width={17}
                      />
                      Register
                    </button>
                  </div>
                </div>
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    Already Register?
                    <Link
                      className="text-pink-600 ml-1.5"
                      href={`${API_ENDPOINT.auth.login}`}
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
