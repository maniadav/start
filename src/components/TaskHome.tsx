import React from "react";
import { CommonButton } from "./ui/CommonButton";
import Link from "next/link";
import { PAGE_ROUTES } from "@constants/route.constant";

interface TaskHomeInterface {
  taskName: any;
  taskMessage: any;
  handleStartGame: any;
}

const TaskHome = ({
  taskName,
  taskMessage,
  handleStartGame,
}: TaskHomeInterface) => {
  return (
    <div className="w-full h-auto">
      <div className="container mx-auto overflow-hidden px-12 md:px-20 py-8">
        <div className="flex justify-between gap-12">
          <div className="flex flex-col justify-center ">
            <div className="w-auto flex flex-row gap-2">
              <Link legacyBehavior href={PAGE_ROUTES.SURVEY.path}>
                <a className="font-bold text-xl md:text-4xl text-primary">←</a>
              </Link>
              <h2 className="text-4xl font-bold text-gray-300 text-transparent bg-clip-text bg-primary">
                {taskName}
              </h2>
            </div>

            <div className="h-1 my-2 border-t border-gray-800"></div>
            <p className="font-serif text-sm  md:text-base text-gray-800 md:pr-20">
              Say to the child
              <strong className="">{`, "${taskMessage}"`}</strong>
            </p>
          </div>
          <div className="">
            <CommonButton
              labelText={"Start Survey"}
              clicked={() => handleStartGame()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHome;
