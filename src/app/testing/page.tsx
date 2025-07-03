"use client";
import React, { useEffect, useRef, useState } from "react";
import { IndexDB_Storage } from "@constants/storage.constant";
import DepthEstimation from "app/wheel-task/DepthEstimation";
import { getIndexedDBValue } from "@utils/indexDB";
import { convertBase64ToFile } from "@helper/binaryConvertion";
import { BASE_URL } from "@constants/config.constant";
import { PopupModal } from "components/common/PopupModal";
import { TasksConstant } from "@constants/tasks.constant";
import MediaPipeHandler from "components/mediapipe/MediaPipeHandler";

const Page = () => {
  const [vidSRC, setVidSRC] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchVideoFromDB = async () => {
      try {
        const videoBase64: string | null = await getIndexedDBValue(
          IndexDB_Storage.temporaryDB,
          IndexDB_Storage.tempVideo
        );
        if (videoBase64) {
          const videoBlob = convertBase64ToFile(videoBase64, "video/webm");
          const videoURL = URL.createObjectURL(videoBlob);
          setVidSRC(videoURL);
        }
      } catch (error) {
        console.error("Error fetching video from IndexedDB:", error);
      }
    };
    fetchVideoFromDB();
  }, []);

  return (
    <div className="w-screen h-screen">
      {/* <TouchPressureComponent /> */}
      {/* <video
        className="h-full w-full rounded-lg bg-gray-800"
        id="webcam"
        src={vidSRC}
        autoPlay
        playsInline
      ></video> */}
      <PopupModal show={true}>
        <MediaPipeHandler
          showFilter={true}
          showAction={true}
          attempt={0}
          taskID={TasksConstant.PreferentialLookingTask.id}
          // videoURL={`${BASE_URL}/large.mp4`}
        />
      </PopupModal>
    </div>
  );
};

export default Page;
