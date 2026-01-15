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
    <div className="w-full rounded-2xl p-8 shadow-2xl border" style={{ background: '#2a002a', borderColor: '#3a003a' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#4f9cf9', color: '#ffffff' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
          Upload Document
        </h2>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3" style={{ color: '#d0a0d0' }}>
          Select a document file
        </label>
        <div className="relative">
          <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all hover:border-[#4f9cf9]" style={{ borderColor: '#3a003a', background: '#1A001A' }}>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isHashing}
              className="block w-full text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                file:mr-4 file:py-3 file:px-6
                file:rounded-xl file:border-0
                file:text-sm file:font-bold
                file:cursor-pointer file:transition-all
                hover:file:shadow-lg"
              style={{
                color: '#d0a0d0',
              }}
            />
            {!file && (
              <div className="mt-4">
                <p className="text-sm" style={{ color: '#b080b0' }}>
                  Click to browse or drag and drop
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isHashing && (
        <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: '#4f9cf9' }}>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Hashing document securely...</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-xl border" style={{ background: '#2a1f1f', borderColor: '#ef4444', color: '#fca5a5' }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {hash && (
        <div className="mt-6 p-6 rounded-xl border" style={{ background: '#1A001A', borderColor: '#3a003a' }}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5" style={{ color: '#10b981' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold" style={{ color: '#10b981' }}>
              Document Hash Generated (SHA-256)
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: '#192830' }}>
            <p className="font-mono text-xs break-all leading-relaxed" style={{ color: '#ffffff' }}>
              {hash}
            </p>
          </div>
          {file && (
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm" style={{ borderColor: '#3a003a' }}>
              <div>
                <span className="font-semibold" style={{ color: '#d0a0d0' }}>File:</span>
                <span className="ml-2 font-mono" style={{ color: '#ffffff' }}>{file.name}</span>
              </div>
              <div className="px-3 py-1 rounded-lg" style={{ background: '#2a002a', color: '#d0a0d0' }}>
                {(file.size / 1024).toFixed(2)} KB
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
