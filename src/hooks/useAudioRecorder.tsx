import CommonIcon from "components/common/CommonIcon";
import React, { useState, useRef, useEffect } from "react";
import { setIndexedDBValue } from "@utils/indexDB";
import { IndexDB_Storage } from "@constants/storage.constant";
import { downloadAudioRecording } from "@utils/download.utils";

// Define proper props interface
interface AudioRecorderProps {
  // Support for both prop names for backward compatibility
  handleAudioRecStop?: (audioData: string) => void;
  handleCloseGame?: (audioData: string) => void;
  filename?: string;
  attempt?: number | string;
}

// Detect audio format support
const getSupportedAudioFormat = (): { mimeType: string; fileExt: string } => {
  const audioTypes = [
    { mimeType: "audio/webm", fileExt: "webm" },
    { mimeType: "audio/mpeg", fileExt: "mp3" },
    { mimeType: "audio/ogg", fileExt: "ogg" },
  ];

  for (const type of audioTypes) {
    if (MediaRecorder.isTypeSupported(type.mimeType)) {
      return type;
    }
  }
  // Fallback to a basic type that most browsers support
  return { mimeType: "", fileExt: "mp3" };
};

const AudioRecorder = ({
  handleAudioRecStop,
  handleCloseGame,
  filename = "recording",
  attempt = "",
}: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioFormat] = useState(getSupportedAudioFormat());

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Enhanced audio constraints for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      console.log("Audio stream created:", stream.id);

      // Check if there are audio tracks available
      if (stream.getAudioTracks().length === 0) {
        console.error("No audio tracks found in the stream");
        alert(
          "Could not access microphone properly. No audio tracks available."
        );
        return;
      }

      // Log audio track settings for debugging
      console.log(
        "Audio track settings:",
        stream.getAudioTracks()[0].getSettings()
      );

      // Create MediaRecorder with supported mime type
      const options: MediaRecorderOptions = {};
      if (audioFormat.mimeType) {
        options.mimeType = audioFormat.mimeType;
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      console.log("MediaRecorder created with options:", options);
      mediaRecorderRef.current = mediaRecorder;

      // Capture data at least every second for better results
      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          console.log(`Received audio chunk: ${e.data.size} bytes`);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped, processing chunks...");
        console.log(`Processing ${chunksRef.current.length} audio chunks`);

        // Make sure we have audio data before proceeding
        if (chunksRef.current.length === 0) {
          console.error("No audio data captured");
          alert("No audio data was captured. Please try again.");
          return;
        }

        // Use the correct MIME type for the blob
        const mimeType = audioFormat.mimeType || "audio/mpeg";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log(
          `Created audio blob: ${blob.size} bytes, type: ${blob.type}`
        );

        if (blob.size <= 0) {
          console.error("Created audio blob is empty");
          alert("Recorded audio appears to be empty. Please try again.");
          return;
        }

        const url = URL.createObjectURL(blob);

        // Save the audio blob
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          console.log(
            `Converted audio to base64, length: ${base64data.length}`
          );

          // Save to IndexedDB
          try {
            await setIndexedDBValue(
              IndexDB_Storage.temporaryDB,
              `${IndexDB_Storage.tempAudio}${attempt}`,
              base64data
            );
            console.log("Audio saved to IndexedDB");
          } catch (error) {
            console.error("Error saving audio to IndexedDB:", error);
          }

          // Download the file using the utility function
          downloadAudioRecording(url, filename, audioFormat.fileExt);

          // Clean up the URL object
          URL.revokeObjectURL(url);

          // Pass the audio data to the callback (support both prop names)
          if (handleAudioRecStop) {
            handleAudioRecStop(base64data);
          } else if (handleCloseGame) {
            handleCloseGame(base64data);
          }
        };

        chunksRef.current = [];
      };

      // Request data every 1 second for smoother recording
      mediaRecorder.start(1000);
      console.log("MediaRecorder started");
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Could not access microphone. Please check your browser permissions."
      );
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    // First stop the media recorder to ensure all data is captured
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      try {
        mediaRecorderRef.current.stop();
        console.log("MediaRecorder stopped");
      } catch (error) {
        console.error("Error stopping media recorder:", error);
      }
    }

    // Reset recording state
    setRecording(false);

    // Clear any timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only after ensuring data is captured, stop the tracks
    // Adding a small delay ensures media recorder has time to process
    setTimeout(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log(`Audio track ${track.id} stopped`);
        });
        streamRef.current = null;
      }
    }, 500);
  };

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
