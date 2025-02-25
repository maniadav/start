import React from "react";
import SurveyDataDetails from "./SurveyDataDetails";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 text-black">
      <h1 className="text-2xl font-bold my-4">Assessment Data Display</h1>
      <SurveyDataDetails />
    </div>
  );
};

export default HomePage;
