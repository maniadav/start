import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { passwordValidator } from "@helper/validator";
import startUtilityAPI from "@services/start.utility";

const UserPasswordUpdate = () => {
  const formData: FormDataType = {};
  const [responseBody, setResponseBody] = useState<FormDataType>(formData);
  const router = useRouter();
  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };

  const handlePasswordUpdate = async () => {
    if (responseBody.newPassword !== responseBody?.newPassword2) {
      toast.error("Password didn't match!");
      return;
    }
    const passwordCheckMSG = passwordValidator(responseBody?.newPassword);
    if (passwordCheckMSG) {
      toast.error(passwordCheckMSG, { duration: 3000 });
      return;
    }

    try {
      const data: any = {
        oldPassword: responseBody.oldPassword,
        password: responseBody.newPassword,
      };

      toast("updating...");
      const res = await startUtilityAPI.auth.updatePassword(data);
      toast(res.data.message);
      if (res.status === 200) {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("something went wrong!");
    }
  };
  return (
    <div className="p-2 md:p-4 border-b my-4" id="password-update">
      <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
        <h2 className="pl-6 text-2xl font-bold sm:text-xl mb-4">
          Change password
        </h2>

        <div className="grid gap-6 mb-6 md:grid-cols-1">
          <div className="mb-6">
            <label
              htmlFor="oldPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Old Password
            </label>
            <input
              onChange={(e) => inputChangeHandler(e)}
              name="oldPassword"
              type="password"
              id="oldPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            ></input>
          </div>
          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              New Password
            </label>
            <input
              onChange={(e) => inputChangeHandler(e)}
              name="newPassword"
              type="password"
              id="newPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            ></input>
          </div>
          <div className="mb-6">
            <label
              htmlFor="newPassword2"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm New Password
            </label>
            <input
              onChange={(e) => inputChangeHandler(e)}
              name="newPassword2"
              type="password"
              id="newPassword2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            ></input>
          </div>
        </div>

        <button
          onClick={() => handlePasswordUpdate()}
          className=" text-white bg-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UserPasswordUpdate;

interface FormDataType {
  [key: string]: string;
}
