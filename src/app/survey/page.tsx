'use client';
import { LOCALSTORAGE } from '@constants/storage.constant';
import { getLocalStorageValue } from '@utils/localStorage';
import SurveyTable from 'components/SurveyTable';
import { IconHome } from 'components/common/Icons';
import Image from 'next/image';

const page = () => {
  const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
  console.log(user);

  return (
    <div className="">
      <div className="grid md:grid-cols-3 h-full md:h-screen">
        <div className="w-full mb-10 col-span-3 md:col-span-2">
          <div className=" mx-auto h-full sm:p-10">
            <nav className="flex px-4 justify-between items-center">
              <div className="flex flex-row gap-4 items-center align-middle">
                <a href="/" className="font-bold text-xl md:text-4xl">
                  <IconHome />
                </a>
                <p className="text-xl md:text-4xl font-bold">
                  Start Your<span className="ml-2 text-primary">Survey</span>
                </p>
              </div>
            </nav>
            <header className="container px-4 lg:flex mt-20 md:mt-10 items-center h-full lg:mt-0">
              <div className="w-full">
                <h1 className="text-4xl lg:text-6xl font-bold">
                  Complete all <span className="text-primary">survey</span> ...
                </h1>
                <div className="w-20 h-2 bg-primary my-4"></div>
                <p className="text-xl mb-10">
                  Perform a series of structured tasks designed to identify
                  early signs of autism in children aged 2-5 years.
                </p>
                <button className="bg-primary text-white text-2xl font-medium px-4 py-2 rounded shadow">
                  Learn More
                </button>
              </div>
            </header>
          </div>
        </div>
        <div className="flex justify-end col-span-3 md:col-span-1">
          <Image
            src="/survey.jpg"
            width={400}
            height={500}
            className="w-full h-full object-cover"
            alt="brain image"
            priority
          />
        </div>
      </div>
      <div className="w-full h-full border-t py-10 md:py-4">
        <div className="container grid lg:grid-cols-2 items-center mx-auto">
          <div className="flex flex-col p-2">
            <p className="max-w-2xl text-lg tracking-tight text-slate-700">
              Welcome to your
              <span className="mx-2 border-b border-dotted border-slate-300 text-primary">
                survey
              </span>
              &
            </p>
            <h1 className="flex gap-2 mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
              <span className="inline-block">Your</span>
              <span className="relative text-primary">User</span>
              <span className="inline-block">Details</span>
            </h1>
          </div>

          <div className="flex justify-center items-center p-8 lg:p-12">
            <div className="w-full max-w-sm  hover:shadow-indigo-300 hover:shadow-lg rounded-lg border">
              <div className="flex justify-center items-start flex-col p-5 ">
                <div className="flex flex-row gap-2 items-center align-middle">
                  <h3 className="text-base md:text-lg font-semibold">
                    User Name:
                  </h3>
                  <p className="capitalize text-xs md:text-sm">
                    {user?.childName || 'User'}
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center align-middle">
                  <h3 className="text-base md:text-lg font-semibold">
                    User ID:
                  </h3>
                  <p className="capitalize text-xs md:text-sm">
                    {user?.childID ?? '1232'}
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center align-middle">
                  <h3 className="text-base md:text-lg font-semibold">DOB:</h3>
                  <p className="text-xs md:text-sm">
                    {user?.childDOB || '23/23/25'}
                  </p>
                </div>
                <div className="capitalize flex flex-row gap-2 items-center align-middle">
                  <h3 className="text-base md:text-lg font-semibold">
                    Gender:
                  </h3>
                  <p className="capitalize text-xs md:text-sm">
                    {user?.childGender}
                  </p>
                </div>
              </div>
              <div className="bg-sky-500 p-0.5 rounded-b-lg"></div>
            </div>
          </div>
        </div>

        <SurveyTable />
      </div>
    </div>
  );
};

export default page;
