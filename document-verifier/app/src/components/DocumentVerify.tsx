import { useState } from 'react';
import { useDocumentProgram } from '../hooks/useDocumentProgram';
import type { DocumentAccount } from '../hooks/useDocumentProgram';
import { PublicKey } from '@solana/web3.js';
import { hexToUint8Array, uint8ArrayToHex } from '../utils/hashing';

export function DocumentVerify() {
  const { verifyDocument } = useDocumentProgram();
  const [hashInput, setHashInput] = useState('');
  const [ownerInput, setOwnerInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [document, setDocument] = useState<DocumentAccount | null>(null);
  const [error, setError] = useState<string>('');

  const handleVerify = async () => {
    if (!hashInput.trim()) {
      setError('Please enter a document hash');
      return;
    }

    if (!ownerInput.trim()) {
      setError('Please enter the owner address');
      return;
    }

    setIsVerifying(true);
    setError('');
    setDocument(null);

    try {
      // Convert hex hash to Uint8Array
      const hash = hexToUint8Array(hashInput.trim());
      if (hash.length !== 32) {
        throw new Error('Hash must be 64 hex characters (32 bytes)');
      }

      // Parse owner address
      const owner = new PublicKey(ownerInput.trim());

      // Verify document
      const doc = await verifyDocument(hash, owner);

      if (!doc) {
        setError('Document not found on blockchain');
      } else {
        setDocument(doc);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify document');
      setDocument(null);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Verify Document
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Hash (64 hex characters)
          </label>
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            placeholder="Enter SHA-256 hash (hex)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
              rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Owner Address (Solana Public Key)
          </label>
          <input
            type="text"
            value={ownerInput}
            onChange={(e) => setOwnerInput(e.target.value)}
            placeholder="Enter owner's Solana address"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
              rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 
            text-white font-bold py-3 px-4 rounded-lg transition-colors
            disabled:cursor-not-allowed"
        >
          {isVerifying ? 'Verifying...' : 'Verify Document'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 
          text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {document && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
            ✓ Document verified!
          </p>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Hash:</span>
              <p className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all mt-1">
                {uint8ArrayToHex(new Uint8Array(document.hash))}
              </p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Owner:</span>
              <p className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all mt-1">
                {document.owner.toBase58()}
              </p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Stored at:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">
                {new Date(document.timestamp.toNumber() * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
