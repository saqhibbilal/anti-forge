import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex flex-col items-end gap-2">
      <WalletMultiButton 
        className="!bg-[#4f9cf9] hover:!bg-[#3d7dd6] !rounded-xl !px-6 !py-3 !text-white !font-bold !text-sm !transition-all !shadow-lg hover:!shadow-xl" 
      />
      {connected && publicKey && (
        <div className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#2a002a', color: '#d0a0d0' }}>
          <span className="font-semibold" style={{ color: '#4f9cf9' }}>Connected:</span>{' '}
          <span className="font-mono">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
}
