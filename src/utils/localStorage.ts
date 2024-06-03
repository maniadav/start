/**
 * @function getLocalStorageValue
 * @param key {string} Key of LocalStorage Item
 * @returns {*}
 */

function getLocalStorageValue(key: string, parse = false) {
    if ("localStorage" in window) {
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
    if ("localStorage" in window) {
        try {
            if (serialize) {
                window.localStorage.setItem(key, JSON.stringify(value));
            } else if (typeof value === "string") {
                window.localStorage.setItem(key, value);
            }
        } catch (e: any) {
            console.log(e);
            throw new Error(e.message);
        }
    }
    return null;
}

function removeLocalStorageValue(key: string) {
    if ("localStorage" in window) {
        window.localStorage.removeItem(key);
    }
}

export {
    getLocalStorageValue,
    removeLocalStorageValue,
    setLocalStorageValue
};
