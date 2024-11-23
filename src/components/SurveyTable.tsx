'use client';
import React from 'react';
import { TasksConstant } from 'constants/tasks.constant';
import { useSurveyContext } from 'state/provider/SurveytProvider';
import { PlusIcon, TickedIcon } from './common/svg';
import { useRouter } from 'next/navigation';

const SurveyTable = () => {
  const { state } = useSurveyContext();
  const router = useRouter();
  // console.log({ state });
  return (
    <section className="text-gray-700 body-font overflow-hidden">
      <div className="container px-5 py-20 mx-auto flex flex-col ">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      ></th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        <h3 className="tracking-widest text-gray-500 font-normal">
                          Attempt
                        </h3>
                        <h2 className="text-5xl text-gray-900 font-medium leading-none mb-4 mt-2">
                          1
                        </h2>
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        <h3 className="tracking-widest text-gray-500 font-normal">
                          Attempt
                        </h3>
                        <h2 className="text-5xl text-gray-900 font-medium leading-none mb-4 mt-2">
                          2
                        </h2>
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        <h3 className="tracking-widest text-gray-500 font-normal">
                          Attempt
                        </h3>
                        <h2 className="text-5xl text-gray-900 font-medium leading-none mb-4 mt-2">
                          3
                        </h2>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(TasksConstant).map(
                      (items: string, i: number) => (
                        <tr
                          key={TasksConstant?.[items].id}
                          className={`${
                            i % 2 == 0 ? 'bg-gray-100' : 'bg-white'
                          } border-b`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {TasksConstant?.[items].title}
                          </td>
                          {Array.from({ length: 3 }, (_, index) => {
                            return (
                              <td
                                key={`${TasksConstant?.[items].id}${index}`}
                                className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                              >
                                {index < state?.[items]?.noOfAttempt ? (
                                  <button
                                    className="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0 cursor-not-allowed"
                                    disabled={true}
                                  >
                                    <TickedIcon />
                                  </button>
                                ) : index === state?.[items]?.noOfAttempt ||
                                  (state?.[items]?.noOfAttempt === undefined &&
                                    index === 0) ? (
                                  <button
                                    onClick={() =>
                                      router.push(
                                        `${
                                          TasksConstant[items].surveyLink
                                        }?attempt=${
                                          parseInt(
                                            state?.[items]?.noOfAttempt || 0,
                                            10
                                          ) + 1
                                        }`
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <PlusIcon />
                                  </button>
                                ) : (
                                  <button
                                    disabled={true}
                                    className="cursor-not-allowed"
                                  >
                                    -
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-12 flex flex-col justify-center gap-y-5 sm:mt-10 sm:flex-row sm:gap-y-0 sm:gap-x-6">
                <a
                  className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900 animate-fade-in-left"
                  href="#"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    role="img"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3 w-3 flex-none"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.824 7.287c.008 0 .004 0 0 0zm-2.8-1.4c.006 0 .003 0 0 0zm16.754 2.161c-.505-1.215-1.53-2.528-2.333-2.943.654 1.283 1.033 2.57 1.177 3.53l.002.02c-1.314-3.278-3.544-4.6-5.366-7.477-.091-.147-.184-.292-.273-.446a3.545 3.545 0 01-.13-.24 2.118 2.118 0 01-.172-.46.03.03 0 00-.027-.03.038.038 0 00-.021 0l-.006.001a.037.037 0 00-.01.005L15.624 0c-2.585 1.515-3.657 4.168-3.932 5.856a6.197 6.197 0 00-2.305.587.297.297 0 00-.147.37c.057.162.24.24.396.17a5.622 5.622 0 012.008-.523l.067-.005a5.847 5.847 0 011.957.222l.095.03a5.816 5.816 0 01.616.228c.08.036.16.073.238.112l.107.055a5.835 5.835 0 01.368.211 5.953 5.953 0 012.034 2.104c-.62-.437-1.733-.868-2.803-.681 4.183 2.09 3.06 9.292-2.737 9.02a5.164 5.164 0 01-1.513-.292 4.42 4.42 0 01-.538-.232c-1.42-.735-2.593-2.121-2.74-3.806 0 0 .537-2 3.845-2 .357 0 1.38-.998 1.398-1.287-.005-.095-2.029-.9-2.817-1.677-.422-.416-.622-.616-.8-.767a3.47 3.47 0 00-.301-.227 5.388 5.388 0 01-.032-2.842c-1.195.544-2.124 1.403-2.8 2.163h-.006c-.46-.584-.428-2.51-.402-2.913-.006-.025-.343.176-.389.206-.406.29-.787.616-1.136.974-.397.403-.76.839-1.085 1.303a9.816 9.816 0 00-1.562 3.52c-.003.013-.11.487-.19 1.073-.013.09-.026.181-.037.272a7.8 7.8 0 00-.069.667l-.002.034-.023.387-.001.06C.386 18.795 5.593 24 12.016 24c5.752 0 10.527-4.176 11.463-9.661.02-.149.035-.298.052-.448.232-1.994-.025-4.09-.753-5.844z"></path>
                  </svg>
                  <button
                    className="ml-3"
                    onClick={() => alert('data is uploaded')}
                  >
                    Upload Survey
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SurveyTable;
