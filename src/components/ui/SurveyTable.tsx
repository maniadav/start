"use client";
import React, { useState } from "react";
import { TasksConstant } from "constants/tasks.constant";
import { useSurveyContext } from "state/provider/SurveytProvider";
import { useRouter } from "next/navigation";
import DataDownloadButton from "../button/DataDownloadButton";
import BatchDataDownloadButton from "../button/BatchDataDownloadButton";
import { FaUpload } from "react-icons/fa6";
import { PAGE_ROUTES } from "@constants/route.constant";
import Link from "next/link";
import { PlusIcon, TickedIcon } from "./svg";

const SurveyTable = () => {
  const { state } = useSurveyContext();
  const router = useRouter();

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
                            i % 2 == 0 ? "bg-gray-100" : "bg-white"
                          } border-b`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {TasksConstant?.[items].title}
                          </td>
                          <td className="">
                            <DataDownloadButton
                              id={TasksConstant?.[items].id}
                            />
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
                                        `/${TasksConstant[items].surveyRoute}`
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
                <div className="mt-12 flex flex-col justify-center gap-y-5 sm:mt-10 sm:flex-row sm:gap-y-0 sm:gap-x-6">
                  <Link
                    className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900 animate-fade-in-left"
                    href={PAGE_ROUTES.MANAGEMENT.OBSERVER.SURVEY_UPLOAD.path}
                  >
                    <FaUpload />
                    <span className="ml-3">Upload Survey</span>
                  </Link>
                  <BatchDataDownloadButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SurveyTable;
