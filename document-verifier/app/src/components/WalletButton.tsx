import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !px-4 !py-2 !text-white !font-medium" />
      {connected && publicKey && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Connected:</span>{' '}
          <span className="font-mono text-xs">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
}
