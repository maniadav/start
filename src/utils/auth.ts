import { LOCALSTORAGE } from "constants/storage.constant";
import { getLocalStorageValue, setLocalStorageValue } from "./localStorage";

export function checkUserLoginStatus() {
    try {
        const currentUser = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
        if (currentUser) {
            return currentUser?._id ? true : false
        }
        return undefined;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

/**Utility to get vendorcode runtime */
export function getVendorCode() {
    const params = new URLSearchParams(window?.location.search);
    const paramCountryName = params.get('countryName');
    let countryName;
    if (paramCountryName) {
        setLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME, paramCountryName)
        countryName = paramCountryName;
    } else if (getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY, true)) {
        countryName = getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME)
    } else {
        countryName = '';
    }
    let vendorCode = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
    if (countryName && countryName !== 'IND' && (vendorCode === 'tmc' || vendorCode === 'srn' || vendorCode === 'orh')) {
        vendorCode = (vendorCode + '-' + countryName).toLowerCase();
    }
    return vendorCode;
}