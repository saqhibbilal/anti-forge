import { useState } from 'react';
import { useDocumentProgram } from '../hooks/useDocumentProgram';
import { PublicKey } from '@solana/web3.js';

interface DocumentStoreProps {
  hash: Uint8Array;
  hashHex: string;
}

export function DocumentStore({ hash, hashHex }: DocumentStoreProps) {
  const { storeDocument, signMessage, isConnected } = useDocumentProgram();
  const [isStoring, setIsStoring] = useState(false);
  const [txSignature, setTxSignature] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleStore = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsStoring(true);
    setError('');
    setTxSignature('');

    try {
      // Step 1: Sign the hash with the wallet
      const signature = await signMessage(hash);

      // Step 2: Store on-chain
      const tx = await storeDocument(hash, signature);

      setTxSignature(tx);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store document');
    } finally {
      setIsStoring(false);
    }
  };

  if (!hashHex) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Store Document on Blockchain
      </h2>

      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This will sign the document hash with your wallet and store it on the Solana blockchain.
          The original document stays private - only the hash is stored.
        </p>
      </div>

      <button
        onClick={handleStore}
        disabled={isStoring || !isConnected}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 
          text-white font-bold py-3 px-4 rounded-lg transition-colors
          disabled:cursor-not-allowed"
      >
        {isStoring ? 'Storing on Blockchain...' : 'Store Document'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 
          text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {txSignature && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            ✓ Document stored successfully!
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transaction Signature:</p>
          <p className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all">
            {txSignature}
          </p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block"
          >
            View on Solana Explorer →
          </a>
        </div>
      )}
    </div>
  );
}
