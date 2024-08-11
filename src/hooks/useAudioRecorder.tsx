import CommonIcon from "components/common/CommonIcon";
import { useState, useRef } from "react";

const AudioRecorder = ({ closeGame }: any) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleRecord = async () => {
    if (!isRecording) {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      closeGame();
    }
  };

  const handleDownload = () => {
    if (audioURL) {
      const a = document.createElement("a");
      a.href = audioURL;
      a.download = "recording.mp3";
      a.click();
    }
  };

  return (
    <div className="w-full justify-center fixed bottom-0 flex flex-col items-center p-4">
      <button
        onClick={handleRecord}
        className={`w-auto items-center justify-center border border-black shadow-lg rounded-full h-16 px-2 py-1 text-white ${
          isRecording ? "bg-red-800" : "bg-blue-800"
        }`}
      >
        {isRecording ? (
          <CommonIcon icon="fluent:mic-pulse-16-filled" />
        ) : (
          <CommonIcon icon="ri:mic-2-line" />
        )}
      </button>
      {audioURL && (
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 rounded-md bg-green-800 text-white"
        >
          Download Recording
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
