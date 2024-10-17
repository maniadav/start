function getLocalStorageValue(key: string, parse = false): any {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    try {
      const storedValue = window.localStorage.getItem(key);
      if (!storedValue) {
        return null;
      }
      if (!parse) {
        return storedValue;
      }

      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}

function setLocalStorageValue<T>(key: string, value: T, serialize?: boolean) {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    try {
      if (serialize) {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else if (typeof value === 'string') {
        window.localStorage.setItem(key, value);
      }
    } catch (e: any) {
      console.log(e);
    }
  }
  return null;
}

function removeLocalStorageValue(key: string) {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    window.localStorage.removeItem(key);
  }
}

export { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue };
