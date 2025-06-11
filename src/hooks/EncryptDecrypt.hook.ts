import CryptoJS from "crypto-js";

// Replace this with your secret key
const SECRET_KEY = "voyagerAid";

/**
 * Generates HMAC (Hash-based Message Authentication Code) for a given string.
 * HMAC ensures data integrity by creating a cryptographic hash with a secret key.
 * @param data - The data to be hashed
 * @returns A SHA256 HMAC of the provided data
 */
const getHmacEncyption = (data: string) => {
  return CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
};

/**
 * Encrypts the provided data using AES encryption and appends HMAC for integrity check.
 * The HMAC is used to ensure that the encrypted data hasn't been tampered with.
 * @param data - The string to be encrypted
 * @returns Encrypted data in the format: encryptedString:HMAC
 */
// AES encryption of the data
export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();

  // Generate HMAC for integrity check
  const combinedData = `${encryptedData}:${getHmacEncyption(encryptedData)}`;
  return combinedData;
};

/**
 * Decrypts the provided encrypted string (which includes an HMAC).
 * First, the HMAC is validated to ensure data integrity before decryption.
 * @param encryptedData - The string in the format: encryptedString:HMAC
 * @throws Error if HMAC validation fails
 * @returns The decrypted original string
 */
export const decryptData = (encryptedData: string): string => {
  const [encryptedString, receivedHmac] = encryptedData.split(":");

  // Validate HMAC to ensure data integrity
  const expectedHmac = getHmacEncyption(encryptedString);

  if (expectedHmac !== receivedHmac)
    throw new Error("Data integrity check failed");

  // AES decryption
  const bytes = CryptoJS.AES.decrypt(encryptedString, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/* NOTE:

    AES encryption typically uses padding (like PKCS7 padding) to ensure that the length of the data being encrypted matches the block size (AES uses a block size of 16 bytes).
    When we append random characters to the encrypted string, it does not necessarily make the decryption process fail because the decryption function still processes the padded blocks correctly, up to the point where it matches the expected length.

* SOLUTION :
    Verify Integrity of Encrypted Data - 
    To make sure that data integrity is checked and that adding random characters causes a failure, Hashing or message authentication code (MAC) alongside encryption imeplemention solves this.

 */
