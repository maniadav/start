import React from "react";
import { CommonButton } from "./common/CommonButton";
import Link from "next/link";

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
      <div className="container mx-auto overflow-hidden py-8 md:py-8">
        <div className="flex justify-between gap-12">
          <div className="flex flex-col justify-center ">
            <div className="w-auto flex flex-row gap-2">
              <Link legacyBehavior href={"/survey"}>
                <a className="font-bold text-xl md:text-4xl text-green-900">
                  ←
                </a>
              </Link>
              <h2 className="text-4xl font-bold text-gray-300 text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">
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
