use anchor_lang::prelude::*;

declare_id!("6CxYpENj7RSchZhUsuo6AFpvPXT5LmNq1BciYw8wV6n6");

#[program]
pub mod document_verifier {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
