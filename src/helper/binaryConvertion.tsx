const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      } else {
        reject('Failed to convert file to base64');
      }
    };

    reader.onerror = () => {
      reject('File reading error');
    };
    reader.readAsDataURL(file);
  });
};

type MimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'video/webm'
  | 'video/mp4'
  | 'application/pdf'
  | 'application/zip'
  | string;

function convertBase64ToFile(
  base64Data: string,
  mimeType: MimeType,
  fileName?: string
): File {
  const binaryString = atob(base64Data.split(',')[1] || base64Data);
  //   const byteNumbers = Array.from(byteCharacters).map((char) =>
  //     char.charCodeAt(0)
  //   );
  //   const byteArray = new Uint8Array(byteNumbers);
  //   return new Blob([byteArray], { type: mimeType });
  // Create a Uint8Array from the binary string
  const binaryLength = binaryString.length;
  const bytes = new Uint8Array(binaryLength);
  for (let i = 0; i < binaryLength; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });

  if (!fileName) {
    const extension = mimeType.split('/')[1] || 'file';
    fileName = `file.${extension}`;
  }

  return new File([blob], fileName, { type: mimeType });
}

export { convertFileToBase64, convertBase64ToFile };
