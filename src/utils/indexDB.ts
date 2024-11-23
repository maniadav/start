function openDatabase(
  dbName: string,
  version: number = 1
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(`Failed to open database: ${dbName}`);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data');
      }
    };
  });
}

async function setIndexedDBValue<T>(dbName: string, key: string, value: T) {
  // console.log({ dbName, key, value });
  try {
    const db = await openDatabase(dbName);
    const tx = db.transaction('data', 'readwrite');
    const store = tx.objectStore('data');
    const request = store.put(value, key);

    // request.onsuccess = () => {
    //   console.log(`Successfully saved data with key ${key} in ${dbName}.`);
    // };

    // request.onerror = (event) => {
    //   console.error(`Error saving value with key ${key} in ${dbName}:`, event);
    // };

    tx.oncomplete = () => {
      // console.log(`Successfully retrived data with key ${key} in ${dbName}.`);
      db.close();
    };

    tx.onerror = (event) => {
      console.error(`Transaction error in ${dbName}:`, event);
    };
  } catch (error) {
    console.error(`Error setting value in ${dbName}:`, error);
  }
}

// Get data from the specified database, optionally parsing it
async function getIndexedDBValue<T>(
  dbName: string,
  key: string
  // parse: boolean = false
): Promise<T | null> {
  try {
    const db = await openDatabase(dbName);
    return new Promise((resolve, reject) => {
      const tx = db.transaction('data', 'readonly');
      const store = tx.objectStore('data');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        // console.log({ result });
        // resolve(parse && result ? JSON.parse(result) : result);
        resolve(result);
        db.close();
      };

      request.onerror = () => {
        reject(`Failed to retrieve data from ${dbName}`);
        db.close();
      };
    });
  } catch (error) {
    console.error(`Error getting value from ${dbName}:`, error);
    return null;
  }
}

// Remove data from the specified database
async function removeIndexedDBValue(dbName: string, key: string) {
  try {
    const db = await openDatabase(dbName);
    const tx = db.transaction('data', 'readwrite');
    const store = tx.objectStore('data');
    store.delete(key);
    tx.oncomplete = () => db.close();
  } catch (error) {
    console.error(`Error removing value from ${dbName}:`, error);
  }
}

export { setIndexedDBValue, getIndexedDBValue, removeIndexedDBValue };
