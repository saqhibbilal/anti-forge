use anchor_lang::prelude::*;

declare_id!("6CxYpENj7RSchZhUsuo6AFpvPXT5LmNq1BciYw8wV6n6");

#[program]
pub mod document_verifier {
    use super::*;

    /// Store a document hash and signature on-chain
    /// Creates a PDA account to store the document metadata
    pub fn store_document(
        ctx: Context<StoreDocument>,
        hash: [u8; 32],
        signature: [u8; 64],
    ) -> Result<()> {
        let document_account = &mut ctx.accounts.document_account;
        let clock = Clock::get()?;

        // Store the document data
        document_account.hash = hash;
        document_account.signature = signature;
        document_account.timestamp = clock.unix_timestamp;
        document_account.owner = ctx.accounts.owner.key();

        msg!(
            "Document stored: Owner: {:?}, Hash: {:?}, Timestamp: {}",
            document_account.owner,
            document_account.hash,
            document_account.timestamp
        );

        Ok(())
    }

    /// Verify a document by reading its stored data
    /// Takes the hash as input to find the PDA account
    pub fn verify_document(
        ctx: Context<VerifyDocument>,
        hash: [u8; 32],
    ) -> Result<()> {
        let document_account = &ctx.accounts.document_account;

        // Verify the hash matches
        require!(
            document_account.hash == hash,
            DocumentVerifierError::HashMismatch
        );

        msg!(
            "Document verified: Owner: {:?}, Hash: {:?}, Timestamp: {}",
            document_account.owner,
            document_account.hash,
            document_account.timestamp
        );

        Ok(())
    }
}

/// Account structure to store document metadata
#[account]
pub struct DocumentAccount {
    pub hash: [u8; 32],        // SHA-256 hash of the document
    pub signature: [u8; 64],   // Ed25519 signature from wallet
    pub timestamp: i64,         // Unix timestamp when stored
    pub owner: Pubkey,         // Public key of the document owner
}

impl DocumentAccount {
    // Account size: 8 (discriminator) + 32 (hash) + 64 (signature) + 8 (timestamp) + 32 (pubkey) = 144 bytes
    pub const SIZE: usize = 8 + 32 + 64 + 8 + 32;
}

/// Accounts required for storing a document
#[derive(Accounts)]
#[instruction(hash: [u8; 32])]
pub struct StoreDocument<'info> {
    #[account(
        init,
        payer = owner,
        space = DocumentAccount::SIZE,
        seeds = [b"document", owner.key().as_ref(), hash.as_ref()],
        bump
    )]
    pub document_account: Account<'info, DocumentAccount>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

/// Accounts required for verifying a document
#[derive(Accounts)]
#[instruction(hash: [u8; 32])]
pub struct VerifyDocument<'info> {
    #[account(
        seeds = [b"document", owner.key().as_ref(), hash.as_ref()],
        bump
    )]
    pub document_account: Account<'info, DocumentAccount>,

    /// CHECK: We only need to verify the owner matches, no need to be a signer for verification
    pub owner: UncheckedAccount<'info>,
}

/// Error codes for the document verifier program
#[error_code]
pub enum DocumentVerifierError {
    #[msg("Hash mismatch - the provided hash does not match the stored document")]
    HashMismatch,
}
