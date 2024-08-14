import CommonIcon from "components/common/CommonIcon";
import React, { useState, useRef } from "react";

const AudioRecorder = ({ handleCloseGame }: any) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e: BlobEvent) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      // Save the audio blob
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        handleCloseGame(reader.result as string);
      };

      chunksRef.current = [];
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  //   const cancelRecording = () => {
  //     if (mediaRecorderRef.current) {
  //       mediaRecorderRef.current.stop();
  //     }
  //     setRecording(false);
  //     setAudioUrl(null);
  //     chunksRef.current = [];

  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //       timerRef.current = null;
  //     }
  //   };

  //   const downloadAudio = () => {
  //     if (audioUrl) {
  //       const a = document.createElement("a");
  //       a.href = audioUrl;
  //       a.download = "recording.mp3";
  //       a.click();
  //     }
  //   };

  //   const loadFromLocalStorage = () => {
  //     const surveyData = getLocalStorageValue("surveyData", true);
  //     const audioBlob = surveyData?.LanguageSamplingTask?.audio;
  //     if (audioBlob) {
  //       setAudioUrl(audioBlob);
  //     }
  //   };

  const handleAudioRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleAudioRecording}
      className={`h-32 px-4 py-1 w-auto items-center justify-center border border-black shadow-lg rounded-full text-white ${
        recording ? "bg-red-800" : "bg-blue-800"
      }`}
    >
      {recording ? (
        <CommonIcon icon="fluent:mic-pulse-16-filled" />
      ) : (
        <CommonIcon icon="ri:mic-2-line" />
      )}
    </button>
  );
};

export default AudioRecorder;
