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
    downloadDictionaryAsFiles(data, fileName);
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
  // const user = LOCALSTORAGE.LOGGED_IN_USER;
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
