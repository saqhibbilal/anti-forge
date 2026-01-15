import { useState } from 'react';
import { hashFile, uint8ArrayToHex } from '../utils/hashing';

interface DocumentUploadProps {
  onHashGenerated: (hash: Uint8Array, hashHex: string) => void;
}

export function DocumentUpload({ onHashGenerated }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setIsHashing(true);
    setHash('');

    try {
      // Hash the file
      const fileHash = await hashFile(selectedFile);
      const hashHex = uint8ArrayToHex(fileHash);
      
      setHash(hashHex);
      onHashGenerated(fileHash, hashHex);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to hash file');
      setFile(null);
    } finally {
      setIsHashing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Upload Document
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select a document file
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isHashing}
          className="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100
            dark:file:bg-purple-900 dark:file:text-purple-300
            cursor-pointer disabled:opacity-50"
        />
      </div>

      {isHashing && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Hashing document...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {hash && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Hash (SHA-256):
          </p>
          <p className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all">
            {hash}
          </p>
          {file && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              File: <span className="font-medium">{file.name}</span> (
              {(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
