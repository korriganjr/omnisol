use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    state::{Oracle, Pool, MINT_AUTHORITY_SEED},
    ErrorCode,
};

pub fn handle(ctx: Context<InitPool>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let mint_authority = ctx.accounts.mint_authority.key;
    let mint = &ctx.accounts.pool_mint;

    if mint.mint_authority.is_none() || mint.mint_authority.unwrap() != *mint_authority {
        msg!("Invalid pool mint authority");
        return Err(ErrorCode::Unauthorized.into());
    }

    pool.authority = ctx.accounts.authority.key();
    pool.pool_mint = ctx.accounts.pool_mint.key();
    pool.oracle = ctx.accounts.oracle.key();
    pool.stake_source = ctx.accounts.stake_source.key();
    pool.authority_bump = ctx.bumps["pool_authority"];
    pool.deposit_amount = 0;
    pool.is_active = true;

    Ok(())
}

#[derive(Accounts)]
pub struct InitPool<'info> {
    #[account(init, payer = authority, space = Pool::SIZE)]
    pub pool: Box<Account<'info, Pool>>,

    #[account(mut)]
    pub oracle: Box<Account<'info, Oracle>>,

    #[account(mut)]
    pub pool_mint: Account<'info, token::Mint>,

    /// CHECK: no needs to check, only for signing
    #[account(seeds = [pool.key().as_ref()], bump)]
    pub pool_authority: AccountInfo<'info>,

    /// CHECK: no needs to check, only for clarifying
    #[account(seeds = [MINT_AUTHORITY_SEED], bump)]
    pub mint_authority: AccountInfo<'info>,

    /// CHECK: Address of LP token or native stake program
    pub stake_source: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
