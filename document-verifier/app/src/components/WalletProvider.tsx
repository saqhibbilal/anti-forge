import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Use devnet for this project
  const network = WalletAdapterNetwork.Devnet;
  
  // Get RPC URL from environment or use devnet default
  const endpoint = useMemo(() => {
    return import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(network);
  }, [network]);

  // Configure wallets (Phantom is the main one we'll use)
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
