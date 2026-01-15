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
    <div className="w-full rounded-2xl p-8 shadow-2xl border" style={{ background: '#1e2d3a', borderColor: '#2d4150' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#4f9cf9', color: '#ffffff' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
          Store on Blockchain
        </h2>
      </div>

      <div className="mb-6 p-5 rounded-xl border" style={{ background: '#192830', borderColor: '#2d4150' }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#4f9cf9' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm leading-relaxed" style={{ color: '#a0aec0' }}>
            This will sign the document hash with your wallet and store it permanently on the Solana blockchain.
            <span className="block mt-2 font-semibold" style={{ color: '#ffffff' }}>
              Your original document stays private - only the hash is stored.
            </span>
          </p>
        </div>
      </div>

      <button
        onClick={handleStore}
        disabled={isStoring || !isConnected}
        className="w-full font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        style={{
          background: isStoring || !isConnected ? '#2d4150' : '#4f9cf9',
          color: '#ffffff',
        }}
        onMouseEnter={(e) => {
          if (!isStoring && isConnected) {
            e.currentTarget.style.background = '#3d7dd6';
          }
        }}
        onMouseLeave={(e) => {
          if (!isStoring && isConnected) {
            e.currentTarget.style.background = '#4f9cf9';
          }
        }}
      >
        {isStoring ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Storing on Blockchain...
          </span>
        ) : (
          'Store Document on Blockchain'
        )}
      </button>

      {error && (
        <div className="mt-6 p-4 rounded-xl border flex items-start gap-3" style={{ background: '#2a1f1f', borderColor: '#ef4444' }}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#fca5a5' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold mb-1" style={{ color: '#fca5a5' }}>Error</p>
            <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        </div>
      )}

      {txSignature && (
        <div className="mt-6 p-6 rounded-xl border" style={{ background: '#1a2e1a', borderColor: '#10b981' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: '#10b981' }}>
                Document Stored Successfully!
              </p>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                Your document hash is now permanently stored on Solana blockchain
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg mb-4" style={{ background: '#192830' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#a0aec0' }}>Transaction Signature:</p>
            <p className="font-mono text-xs break-all leading-relaxed" style={{ color: '#ffffff' }}>
              {txSignature}
            </p>
          </div>
          
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg"
            style={{ background: '#4f9cf9', color: '#ffffff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3d7dd6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#4f9cf9';
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Solana Explorer
          </a>
        </div>
      )}
    </div>
  );
}
