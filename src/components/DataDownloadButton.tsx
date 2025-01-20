import { IndexDB_Storage, LOCALSTORAGE } from '@constants/storage.constant';
import { getIndexedDBValue } from '@utils/indexDB';
import { getLocalStorageValue } from '@utils/localStorage';
import React from 'react';

import { FaDownload } from 'react-icons/fa6';

function DataDownloadButton({ id }: { id: string }) {
  const handleDownload = async () => {
    const survey: any = await getIndexedDBValue(
      IndexDB_Storage.surveyDB,
      IndexDB_Storage.surveyData
    );
    const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const fileName = `child_id_${user.childID}_${id}_${formattedDate}`;

    const data = survey[id];
    // downloadDictionaryAsFiles(data.attempt1, fileName);
    jsonToCsv(data, fileName);
  };

  return (
    <button
      className="text-lg w-5 h-5 inline-flex items-center justify-center  text-black rounded-full flex-shrink-0 cursor-pointer"
      onClick={() => {
        handleDownload();
      }}
    >
      <FaDownload />
    </button>
  );
}

export default DataDownloadButton;

function downloadDictionaryAsFiles(
  data: { [s: string]: unknown } | ArrayLike<unknown> | null,
  fileName: any
) {
  if (typeof data !== 'object' || Array.isArray(data) || data === null) {
    alert('Provided data is not a dictionary!');
    return;
  }

  // Convert dictionary to an array of key-value pairs
  const dataArray = Object.entries(data).map(([key, value]) => ({
    key,
    value,
  }));

  // Generate CSV content
  const csvHeader = 'Key,Value';
  const csvRows = dataArray.map((row) => `"${row.key}","${row.value}"`);
  const csvContent = [csvHeader, ...csvRows].join('\n');
  const csvBlob = new Blob([csvContent], { type: 'text/csv' });
  const csvLink = document.createElement('a');
  csvLink.href = URL.createObjectURL(csvBlob);
  csvLink.download = `${fileName}.csv`;
  csvLink.click();

  // Generate JSON content
  const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const jsonLink = document.createElement('a');
  jsonLink.href = URL.createObjectURL(jsonBlob);
  jsonLink.download = `${fileName}.json`;
  jsonLink.click();
}
function jsonToCsv(jsonData: any, fileName: string = 'data.csv') {
  // Initialize headers and rows
  const headers = new Set<string>(); // To store unique column headers
  const rows: Record<string, any>[] = []; // To store the rows of data

  // Recursive function to process the JSON object
  function processKey(key: string, value: any) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      value === undefined ||
      value === 0
    ) {
      // Add as a single column
      if (!rows[0]) rows[0] = {};
      rows[0][key] = value;
      headers.add(key);
    } else if (Array.isArray(value)) {
      // Populate them vertically
      headers.add(key); // Key as a header
      value.forEach((val, index) => {
        if (!rows[index]) rows[index] = {};
        rows[index][key] = val;
      });
    } else if (typeof value === 'object' && value !== null) {
      // If value is an object, process its keys
      Object.keys(value).forEach((nestedKey) => {
        processKey(`${key}_${nestedKey}`, value[nestedKey]);
      });
    }
  }

  // Process each key in the JSON data
  Object.entries(jsonData).forEach(([key, value]) => {
    processKey(key, value);
  });

  // Generate CSV content
  const headerList = Array.from(headers); // Convert headers to a list (not sorted)
  const csvContent = [
    headerList.join(','), // Header row
    ...rows.map((row) =>
      headerList
        .map((header) =>
          row[header] === undefined || row[header] === null
            ? '""'
            : `"${row[header]}"`
        )
        .join(',')
    ),
  ].join('\n');

  // Create and download the CSV file
  const csvBlob = new Blob([csvContent], { type: 'text/csv' });
  const csvLink = document.createElement('a');
  csvLink.href = URL.createObjectURL(csvBlob);
  csvLink.download = fileName;
  csvLink.click();
}
