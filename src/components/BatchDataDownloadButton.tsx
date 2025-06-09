import { IndexDB_Storage, LOCALSTORAGE } from "@constants/storage.constant";
import { getIndexedDBValue } from "@utils/indexDB";
import { getLocalStorageValue } from "@utils/localStorage";
import React from "react";
import JSZip from "jszip";
import { FaDownload } from "react-icons/fa6";
import { downloadMediaUtilities } from "@utils/download.utils";
import {
  LanguageSamplingContent,
  MotorFollowingContent,
} from "@constants/tasks.constant";

export const handleBatchDownload = async () => {
  const survey: any = await getIndexedDBValue(
    IndexDB_Storage.surveyDB,
    IndexDB_Storage.surveyData
  );
  const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  if (survey) {
    const zip = new JSZip();

    // Add each survey entry to the ZIP
    Object.keys(survey).forEach((id) => {
      const data = survey[id];
      const rawfileName = `child_${user.childID}_observer_${user.observerID}_${id}_${formattedDate}`;
      const fileName = `${rawfileName}.csv`;

      if (id === MotorFollowingContent.id) {
        try {
          const imageCount = downloadMediaUtilities("image", fileName);
        } catch (error) {
          console.error("Error downloading images:", error);
        }
      }

      if (id === LanguageSamplingContent.id) {
        try {
          const audioCount = downloadMediaUtilities("audio", fileName);
        } catch (error) {
          console.error("Error downloading audio files:", error);
        }
      }
      const csvContent = generateCsv(data);
      zip.file(fileName, csvContent);
    });

    //  downlaod media files seperately

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(zipBlob);
    const zipLink = document.createElement("a");
    zipLink.href = zipUrl;
    zipLink.download = `start_child_id_${user.childID}_observer_id_${user.observerID}_${formattedDate}.zip`;
    zipLink.click();
    URL.revokeObjectURL(zipUrl); // Clean up memory
  }
};

function BatchDataDownloadButton() {
  return (
    <div className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900 animate-fade-in-left">
      <FaDownload />
      <button className="ml-3" onClick={() => handleBatchDownload()}>
        Download Batch Data
      </button>
    </div>
  );
}

function generateCsv(jsonData: any): string {
  const headers = new Set<string>();
  const rows: Record<string, any>[] = [];

  function processKey(key: string, value: any) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null ||
      value === undefined ||
      value === 0
    ) {
      if (!rows[0]) rows[0] = {};
      rows[0][key] = value;
      headers.add(key);
    } else if (Array.isArray(value)) {
      headers.add(key);
      value.forEach((val, index) => {
        if (!rows[index]) rows[index] = {};
        rows[index][key] = val;
      });
    } else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((nestedKey) => {
        processKey(`${key}_${nestedKey}`, value[nestedKey]);
      });
    }
  }

  Object.entries(jsonData).forEach(([key, value]) => {
    processKey(key, value);
  });

  const headerList = Array.from(headers);
  return [
    headerList.join(","),
    ...rows.map((row) =>
      headerList
        .map((header) =>
          row[header] === undefined || row[header] === null
            ? '""'
            : `"${row[header]}"`
        )
        .join(",")
    ),
  ].join("\n");
}

export default BatchDataDownloadButton;
