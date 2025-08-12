"use client";
import SidebarTrigger from "@management/SidebarTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { useAuth } from "state/provider/AuthProvider";
import UserComp from "components/UserComp";
import SurveyTable from "components/SurveyTable";
import { PAGE_ROUTES } from "@constants/route.constant";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoginDataType {
  childId: string;
  childName: string;
  childGender: string;
  childDob: string;
  observerId: string;
}

const SurveyPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user || !user?.childId) {
      router.push(PAGE_ROUTES.MANAGEMENT.OBSERVER.CHILD.path);
    }
  }, [router, user]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-3xl font-bold tracking-tight">Start Survey</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 mt-4 rounded">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-medium">
                    <strong>Info:</strong>{" "}
                    {`Click on the plus (+) icon to
                    start the survey.`}
                  </p>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  <span className="relative text-primary">Child</span>
                  <span className="inline-block">Details</span>
                </h1>
              </div>
              <UserComp />
            </div>

            <SurveyTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyPage;
