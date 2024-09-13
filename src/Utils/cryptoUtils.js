// src/utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

const secretKey = 'mySecretKey'; // Replace with your actual secret key

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const setLocalStorageData = (key, data) => {
    const encryptedData = encryptData(data);
    localStorage.setItem(key, encryptedData);
};

export const getLocalStorageData = (key) => {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
        return decryptData(encryptedData);
    }
    return null;
};
