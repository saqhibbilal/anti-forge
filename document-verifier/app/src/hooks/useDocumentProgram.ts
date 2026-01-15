import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import IDL from '../idl/document_verifier.json';
import { PROGRAM_ID } from '../utils/solana';

export interface DocumentAccount {
  hash: number[];
  signature: number[];
  timestamp: BN;
  owner: PublicKey;
}

export function useDocumentProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    if (!wallet.publicKey) return null;

    const provider = new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    );

    return new Program(IDL as any, PROGRAM_ID, provider);
  }, [connection, wallet]);

  /**
   * Store a document on-chain
   */
  const storeDocument = async (
    hash: Uint8Array,
    signature: Uint8Array
  ): Promise<string> => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // Find PDA for the document account
      const [documentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('document'),
          wallet.publicKey.toBuffer(),
          hash,
        ],
        program.programId
      );

      // Convert Uint8Array to number[] for Anchor
      const hashArray = Array.from(hash);
      const signatureArray = Array.from(signature);

      // Call the store_document instruction
      const tx = await program.methods
        .storeDocument(hashArray, signatureArray)
        .accounts({
          documentAccount: documentPda,
          owner: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error storing document:', error);
      throw error;
    }
  };

  /**
   * Verify a document by reading its stored data
   */
  const verifyDocument = async (
    hash: Uint8Array,
    owner: PublicKey
  ): Promise<DocumentAccount | null> => {
    if (!program) {
      throw new Error('Program not initialized');
    }

    try {
      // Find PDA for the document account
      const [documentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('document'),
          owner.toBuffer(),
          hash,
        ],
        program.programId
      );

      // Fetch the account data (Anchor converts snake_case to camelCase)
      const account = await program.account.documentAccount.fetch(documentPda);
      
      return account as DocumentAccount;
    } catch (error) {
      // Account doesn't exist or other error
      console.error('Error verifying document:', error);
      return null;
    }
  };

  /**
   * Sign a message (hash) with the wallet
   */
  const signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
    if (!wallet.signMessage) {
      throw new Error('Wallet does not support message signing');
    }

    try {
      const signature = await wallet.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  return {
    program,
    storeDocument,
    verifyDocument,
    signMessage,
    isConnected: !!wallet.publicKey,
  };
}
