// utils/flattenJson.ts

type FlatJson = { [key: string]: any };

export const flattenJson = (
  data: any,
  parentKey = "",
  result: FlatJson = {}
): FlatJson => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (
        typeof data[key] === "object" &&
        data[key] !== null &&
        !Array.isArray(data[key])
      ) {
        flattenJson(data[key], newKey, result);
      } else if (Array.isArray(data[key])) {
        result[newKey] = data[key].join(";"); // join array values with a semicolon
      } else {
        result[newKey] = data[key];
      }
    }
  }
  return result;
};

// utils/jsonToCsv.ts
export const jsonToCsv = (jsonObject: any[]): any => {
  // if (!jsonObject.length) {
  //     return '';
  // }

  // const headers = Object.keys(jsonObject[0]).join(',');
  // const rows = jsonObject.map(obj => Object.values(obj).join(',')).join('\n');
  // return `${headers}\n${rows}`;

  // const flatObject = flattenJson(jsonObject);

  // const headers = Object.keys(flatObject).join(',');
  // const values = Object.values(flatObject).join(',');
  let blob = new Blob([JSON.stringify(jsonObject)], {
    type: "application/json",
  });

  return blob; //`${headers}\n${values}`;
};

export const downloadFile = (obj: any, filename: string): void => {
  // const blob = new Blob([obj], { type: 'text/csv' }); // save as csv file
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
  window.URL.revokeObjectURL(url);
};
