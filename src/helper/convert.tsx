/** image onto base64 */
export default function convertToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export function formatDate(inputDate: string) {
  const date = new Date(inputDate);

  // Extract day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: Months are zero-based
  const year = date.getFullYear();

  // Format the date components and remove leading zeros
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
