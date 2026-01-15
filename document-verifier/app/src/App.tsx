import { useState } from 'react';
import { WalletButton } from './components/WalletButton';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentStore } from './components/DocumentStore';
import { DocumentVerify } from './components/DocumentVerify';

function App() {
  const [hash, setHash] = useState<Uint8Array | null>(null);
  const [hashHex, setHashHex] = useState<string>('');

  const handleHashGenerated = (hashBytes: Uint8Array, hex: string) => {
    setHash(hashBytes);
    setHashHex(hex);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Document Verifier
            </h1>
            <WalletButton />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Securely store and verify document hashes on the Solana blockchain
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Upload Section */}
          <DocumentUpload onHashGenerated={handleHashGenerated} />

          {/* Store Section */}
          {hash && hashHex && (
            <DocumentStore hash={hash} hashHex={hashHex} />
          )}

          {/* Verify Section */}
          <DocumentVerify />
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built on Solana Devnet • Document hashes only, original files stay private</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
