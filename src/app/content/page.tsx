import React from "react";
import SurveyDataDetails from "./SurveyDataDetails";
import TopNav from "components/TopNav";

const HomePage = () => {
  return (
    <div className="w-full p-8">
      <TopNav primaryText={"Assessment"} secondaryText={"Data"} />
      <div className="container mx-auto py-20 px-4 text-black">
        <SurveyDataDetails />
      </div>
    </div>
  );
};

export default HomePage;
