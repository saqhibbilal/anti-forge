import CryptoJS from 'crypto-js';

/**
 * Hash a file using SHA-256
 * @param file - The file to hash
 * @returns Promise that resolves to the hash as a Uint8Array (32 bytes)
 */
export async function hashFile(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.SHA256(wordArray);
        
        // Convert hash to Uint8Array (32 bytes)
        const hashArray = new Uint8Array(32);
        const words = hash.words;
        
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          hashArray[i * 4] = (word >>> 24) & 0xff;
          hashArray[i * 4 + 1] = (word >>> 16) & 0xff;
          hashArray[i * 4 + 2] = (word >>> 8) & 0xff;
          hashArray[i * 4 + 3] = word & 0xff;
        }
        
        resolve(hashArray);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert a hex string to Uint8Array
 * @param hex - Hex string
 * @returns Uint8Array
 */
export function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 * @param bytes - Uint8Array
 * @returns Hex string
 */
export function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
