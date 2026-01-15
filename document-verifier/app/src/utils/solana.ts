import { Connection, clusterApiUrl } from '@solana/web3.js';

// Get RPC URL from environment or use devnet default
const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl('devnet');

// Create and export the Solana connection
export const connection = new Connection(RPC_URL, 'confirmed');

// Program ID from environment or default
export const PROGRAM_ID = import.meta.env.VITE_PROGRAM_ID || '6CxYpENj7RSchZhUsuo6AFpvPXT5LmNq1BciYw8wV6n6';
