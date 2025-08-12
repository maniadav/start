import React, { useState } from 'react';

const ZipToBase64 = () => {
  const [base64Data, setBase64Data] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError('No file selected');
      return;
    }

    if (file.type !== 'application/zip') {
      setError('Please upload a valid zip file.');
      return;
    }

    convertZipToBase64(file);
  };

  const convertZipToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1]; // Remove data URL prefix
      setBase64Data(base64Data);
      console.log({ base64Data });
      //   onBase64Ready(base64Data); // Pass base64 data to parent
    };
    reader.onerror = () => {
      setError('Error reading the file.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="zip-to-base64">
      <input type="file" accept=".zip" onChange={handleFileChange} />
      {error && <p className="error-message">{error}</p>}
      {base64Data && (
        <div className="output">
          <p>Base64 data ready for backend!</p>
          <textarea rows={10} value={base64Data} readOnly />
        </div>
      )}
      <DownloadZipButton
        base64ZipData={base64Data}
        fileName="your-archive.zip"
      />
    </div>
  );
};

export default ZipToBase64;

type DownloadZipButtonProps = {
  base64ZipData: string;
  fileName: string;
};

const DownloadZipButton: React.FC<DownloadZipButtonProps> = ({
  base64ZipData,
  fileName,
}) => {
  const downloadZip = () => {
    // Convert base64 string back to binary data
    const byteCharacters = atob(base64ZipData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a blob from the byte array and prepare the download link
    const blob = new Blob([byteArray], { type: 'application/zip' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = 'none';

    // Append to the DOM, trigger the download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={downloadZip} className="bg-red-600 p-20">
      Download ZIP
    </button>
  );
};
