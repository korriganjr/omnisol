/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category WithdrawLpTokens
 * @category generated
 */
export interface WithdrawLpTokensInstructionArgs {
  amount: beet.bignum
  withBurn: boolean
}
/**
 * @category Instructions
 * @category WithdrawLpTokens
 * @category generated
 */
export const withdrawLpTokensStruct = new beet.BeetArgsStruct<
  WithdrawLpTokensInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
    ['withBurn', beet.bool],
  ],
  'WithdrawLpTokensInstructionArgs',
)
/**
 * Accounts required by the _withdrawLpTokens_ instruction
 *
 * @property [_writable_] pool
 * @property [] poolAuthority
 * @property [_writable_] user
 * @property [_writable_] collateral
 * @property [_writable_] source
 * @property [_writable_] destination
 * @property [] lpToken
 * @property [_writable_] poolMint
 * @property [_writable_] userPoolToken
 * @property [_writable_, **signer**] authority
 * @property [] clock
 * @category Instructions
 * @category WithdrawLpTokens
 * @category generated
 */
export interface WithdrawLpTokensInstructionAccounts {
  pool: web3.PublicKey
  poolAuthority: web3.PublicKey
  user: web3.PublicKey
  collateral: web3.PublicKey
  source: web3.PublicKey
  destination: web3.PublicKey
  lpToken: web3.PublicKey
  poolMint: web3.PublicKey
  userPoolToken: web3.PublicKey
  authority: web3.PublicKey
  clock: web3.PublicKey
  tokenProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const withdrawLpTokensInstructionDiscriminator = [
  58, 6, 25, 91, 179, 55, 213, 78,
]

/**
 * Creates a _WithdrawLpTokens_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WithdrawLpTokens
 * @category generated
 */
export function createWithdrawLpTokensInstruction(
  accounts: WithdrawLpTokensInstructionAccounts,
  args: WithdrawLpTokensInstructionArgs,
  programId = new web3.PublicKey('6sccaGNYx7RSjVgFD13UKE7dyUiNavr2KXgeqaQvZUz7'),
) {
  const [data] = withdrawLpTokensStruct.serialize({
    instructionDiscriminator: withdrawLpTokensInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.pool,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.poolAuthority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.user,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collateral,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.source,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.destination,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.lpToken,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.poolMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userPoolToken,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.clock,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
