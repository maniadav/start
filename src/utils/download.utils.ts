/**
 * Utility functions for downloading files in the browser
 */
import { getIndexedDBValue } from "@utils/indexDB";
import { IndexDB_Storage, LOCALSTORAGE } from "@constants/storage.constant";
import { getLocalStorageValue } from "@utils/localStorage";

// Downloads a file from a URL or Blob

export const downloadFile = (url: string, filename: string): void => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Downloads an audio recording with a timestamped filename
export const downloadAudioRecording = (
  url: string,
  prefix: string = "recording",
  format: string = "mp3"
): void => {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const safePrefix = prefix || "recording";
  const safeFormat = format || "mp3";
  const filename = `${safePrefix}-${timestamp}.${safeFormat}`;
  console.log(`Downloading audio with filename: ${filename}`);
  downloadFile(url, filename);
};

/**
 * Downloads base64 media files (audio or images) for a specific task and attempts
 * @param type Media type: "audio" or "image"
 * @param taskId The task identifier
 * @param attempts considering 3 attempts for downloading
 * @returns Promise resolving to the count of successfully downloaded files
 */

export const downloadMediaUtilities = async (
  type: "audio" | "image",
  fileName: string = "media_download",
  attempts: number[] = [1, 2, 3]
): Promise<number> => {
  try {
    let successCount = 0;

    for (const attempt of attempts) {
      // Get the appropriate key based on media type
      const storageKey =
        type === "audio"
          ? `${IndexDB_Storage.tempAudio}${attempt}`
          : `${IndexDB_Storage.tempImage}${attempt}`;

      // Get data from IndexedDB
      const mediaData: string =
        (await getIndexedDBValue(IndexDB_Storage.temporaryDB, storageKey)) ||
        "";

      if (!mediaData) {
        console.warn(`No ${type} found for attempt ${attempt}`);
        continue;
      } else {
        // Detect file type from the base64 data
        const { extension, mimeType } = getFileInfoFromBase64(mediaData);

        const file = `${fileName}_attempt${attempt}_${type}.${extension}`;

        console.log(
          `Downloading ${type} file with detected type: ${mimeType}, extension: ${extension}`
        );

        // Download the file
        const link = document.createElement("a");
        link.href = mediaData;
        link.download = file as string; // Type assertion to handle the error
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up URL object if it's a blob URL
        if (typeof mediaData === "string" && mediaData.startsWith("blob:")) {
          URL.revokeObjectURL(mediaData);
        }
        successCount++;
      }
    }

    return successCount;
  } catch (error) {
    console.error(`Error downloading ${type} files:`, error);
    return 0;
  }
};

/**
 * Gets file extension and mime type from base64 data URL
 * @param dataUrl Base64 data URL
 * @returns Object with extension and mimeType properties
 */
const getFileInfoFromBase64 = (
  dataUrl: string
): { extension: string; mimeType: string } => {
  // Default values if we can't detect
  let extension = "bin";
  let mimeType = "application/octet-stream";

  try {
    // Check if it's a valid data URL
    if (dataUrl && dataUrl.includes("data:") && dataUrl.includes(";base64,")) {
      // Extract the mime type from the data URL
      const matches = dataUrl.match(/^data:([^;]+);base64,/);
      if (matches && matches.length > 1) {
        mimeType = matches[1];

        // Determine file extension based on mime type
        if (mimeType.includes("audio/")) {
          const audioType = mimeType.split("/")[1];
          // Handle special cases
          if (audioType === "mpeg") {
            extension = "mp3";
          } else if (audioType === "wav" || audioType === "x-wav") {
            extension = "wav";
          } else if (audioType === "ogg") {
            extension = "ogg";
          } else {
            extension = audioType;
          }
        } else if (mimeType.includes("image/")) {
          extension = mimeType.split("/")[1];
        } else if (mimeType.includes("video/")) {
          extension = mimeType.split("/")[1];
        }
      } else if (dataUrl && !dataUrl.includes("data:")) {
        // Handle raw base64 without MIME type
        // Try to determine from first few bytes (simplified)
        if (dataUrl.startsWith("/9j/")) {
          mimeType = "image/jpeg";
          extension = "jpg";
        } else if (dataUrl.startsWith("iVBOR")) {
          mimeType = "image/png";
          extension = "png";
        } else if (dataUrl.startsWith("UklGR")) {
          mimeType = "audio/wav";
          extension = "wav";
        } else if (dataUrl.startsWith("GkXf")) {
          mimeType = "audio/webm";
          extension = "webm";
        } else {
          // Default to mp3 for audio contexts if we can't determine
          mimeType = "audio/mpeg";
          extension = "mp3";
        }
      }
    }
  } catch (error) {
    console.warn("Failed to detect file type from base64:", error);
  }

  return { extension, mimeType };
};
