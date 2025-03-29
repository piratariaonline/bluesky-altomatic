import CryptoJS from 'crypto-js';

const ENCRYPTED_SESSION_KEY = process.env.REACT_APP_SECURITY_KEY!;

export default class DataEncrypter {
	encryptData(data: string): string {
		return CryptoJS.AES.encrypt(data, ENCRYPTED_SESSION_KEY).toString();
	}
	  
	decryptData(encryptedData: string): string {
		const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTED_SESSION_KEY);
		return bytes.toString(CryptoJS.enc.Utf8);
	}
}