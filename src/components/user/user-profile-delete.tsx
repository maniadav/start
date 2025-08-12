import toast from "react-hot-toast";

const UserProfileDelete = () => {
  const handleAccountDelete = () => {
    toast.error("Please contact admin for account deletion!", {
      duration: 3000,
    });
  };
  return (
    <div className="p-2 md:p-4 border-b my-4" id="delete-account">
      <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
        <h2 className="pl-6 text-2xl font-bold sm:text-xl mb-4">
          Delete Account
        </h2>
        <p className="mb-3 text-base text-gray-800">
          No longer want to use our service? You can delete your account here.
          This action is not reversible. All information related to this account
          will be deleted permanently.
        </p>

        <button
          onClick={() => handleAccountDelete()}
          className=" text-white bg-gradient-to-br from-red-500 to-red-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Yes, delete my account
        </button>
      </div>
    </div>
  );
};

export default UserProfileDelete;
