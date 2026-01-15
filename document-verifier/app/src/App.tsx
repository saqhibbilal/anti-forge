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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1A001A 0%, #2a002a 100%)' }}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-5xl font-bold mb-2" style={{ color: '#ffffff' }}>
                Anti Forge
              </h1>
              <p className="text-lg" style={{ color: '#d0a0d0' }}>
                Securely store and verify document hashes on the Solana blockchain
              </p>
            </div>
            <WalletButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
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
        <footer className="mt-16 pt-8 border-t text-center text-sm" style={{ borderColor: '#3a003a', color: '#b080b0' }}>
          <p>Built on Solana Devnet • Document hashes only, original files stay private</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
