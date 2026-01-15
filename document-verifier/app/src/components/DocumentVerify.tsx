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
    <div className="w-full rounded-2xl p-8 shadow-2xl border" style={{ background: '#2a002a', borderColor: '#3a003a' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#4f9cf9', color: '#ffffff' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
          Verify Document
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#d0a0d0' }}>
            Document Hash (64 hex characters)
          </label>
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            placeholder="Enter SHA-256 hash (hex)"
            className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none font-mono text-sm"
            style={{
              background: '#1A001A',
              borderColor: '#3a003a',
              color: '#ffffff',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4f9cf9';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3a003a';
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#d0a0d0' }}>
            Owner Address (Solana Public Key)
          </label>
          <input
            type="text"
            value={ownerInput}
            onChange={(e) => setOwnerInput(e.target.value)}
            placeholder="Enter owner's Solana address"
            className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none font-mono text-sm"
            style={{
              background: '#1A001A',
              borderColor: '#3a003a',
              color: '#ffffff',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4f9cf9';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3a003a';
            }}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          style={{
            background: isVerifying ? '#3a003a' : '#4f9cf9',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            if (!isVerifying) {
              e.currentTarget.style.background = '#3d7dd6';
            }
          }}
          onMouseLeave={(e) => {
            if (!isVerifying) {
              e.currentTarget.style.background = '#4f9cf9';
            }
          }}
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </span>
          ) : (
            'Verify Document'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl border flex items-start gap-3" style={{ background: '#2a1f1f', borderColor: '#ef4444' }}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#fca5a5' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold mb-1" style={{ color: '#fca5a5' }}>Verification Failed</p>
            <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        </div>
      )}

      {document && (
        <div className="mt-6 p-6 rounded-xl border" style={{ background: '#1a2e1a', borderColor: '#10b981' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: '#10b981' }}>
                Document Verified!
              </p>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>
                This document is authentic and stored on the blockchain
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#1A001A' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#d0a0d0' }}>Hash:</p>
              <p className="font-mono text-xs break-all leading-relaxed" style={{ color: '#ffffff' }}>
                {uint8ArrayToHex(new Uint8Array(document.hash))}
              </p>
            </div>
            
            <div className="p-4 rounded-lg" style={{ background: '#1A001A' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#d0a0d0' }}>Owner:</p>
              <p className="font-mono text-xs break-all leading-relaxed" style={{ color: '#ffffff' }}>
                {document.owner.toBase58()}
              </p>
            </div>
            
            <div className="p-4 rounded-lg flex items-center justify-between" style={{ background: '#1A001A' }}>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: '#d0a0d0' }}>Stored At:</p>
                <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>
                  {new Date(document.timestamp.toNumber() * 1000).toLocaleString()}
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-lg" style={{ background: '#2a002a', color: '#4f9cf9' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
