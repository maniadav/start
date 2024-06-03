// date in DD//MM/YY format
export function currentDate() {
  const currentDate = new Date();

  // Extract day, month, and year
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Note: Months are zero-based
  const year = currentDate.getFullYear();

  // Format the date components and remove leading zeros
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}
