"use client";
import SuspenseWrapper from "components/SuspenseWrapper";
import GazeCloud from "./GazeCloud";
import WebGazer from "./WebGazer";

const IndexPage = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      {/* <GazeCloud /> */}
      {/* <WebGazer isSurvey={false} /> */}
    </div>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <IndexPage />
    </SuspenseWrapper>
  );
}
