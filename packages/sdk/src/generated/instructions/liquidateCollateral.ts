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
 * @category LiquidateCollateral
 * @category generated
 */
export interface LiquidateCollateralInstructionArgs {
  amount: beet.bignum
}
/**
 * @category Instructions
 * @category LiquidateCollateral
 * @category generated
 */
export const liquidateCollateralStruct = new beet.BeetArgsStruct<
  LiquidateCollateralInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
  ],
  'LiquidateCollateralInstructionArgs',
)
/**
 * Accounts required by the _liquidateCollateral_ instruction
 *
 * @property [_writable_] pool
 * @property [] poolAuthority
 * @property [_writable_] collateral
 * @property [_writable_] userOwner
 * @property [_writable_] userWallet
 * @property [_writable_] user
 * @property [_writable_] withdrawInfo
 * @property [_writable_] oracle
 * @property [_writable_] sourceStake
 * @property [] poolAccount
 * @property [] solReserves
 * @property [] protocolFee
 * @property [] protocolFeeDestination
 * @property [] feeAccount
 * @property [] stakeAccountRecord
 * @property [_writable_, **signer**] authority
 * @property [] clock
 * @property [] stakeProgram
 * @category Instructions
 * @category LiquidateCollateral
 * @category generated
 */
export interface LiquidateCollateralInstructionAccounts {
  pool: web3.PublicKey
  poolAuthority: web3.PublicKey
  collateral: web3.PublicKey
  userOwner: web3.PublicKey
  userWallet: web3.PublicKey
  user: web3.PublicKey
  withdrawInfo: web3.PublicKey
  oracle: web3.PublicKey
  sourceStake: web3.PublicKey
  poolAccount: web3.PublicKey
  solReserves: web3.PublicKey
  protocolFee: web3.PublicKey
  protocolFeeDestination: web3.PublicKey
  feeAccount: web3.PublicKey
  stakeAccountRecord: web3.PublicKey
  authority: web3.PublicKey
  clock: web3.PublicKey
  tokenProgram?: web3.PublicKey
  stakeProgram: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const liquidateCollateralInstructionDiscriminator = [
  160, 199, 78, 141, 140, 146, 166, 212,
]

/**
 * Creates a _LiquidateCollateral_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category LiquidateCollateral
 * @category generated
 */
export function createLiquidateCollateralInstruction(
  accounts: LiquidateCollateralInstructionAccounts,
  args: LiquidateCollateralInstructionArgs,
  programId = new web3.PublicKey('6sccaGNYx7RSjVgFD13UKE7dyUiNavr2KXgeqaQvZUz7'),
) {
  const [data] = liquidateCollateralStruct.serialize({
    instructionDiscriminator: liquidateCollateralInstructionDiscriminator,
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
      pubkey: accounts.collateral,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userOwner,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userWallet,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.user,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.withdrawInfo,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.oracle,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.sourceStake,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.poolAccount,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.solReserves,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.protocolFee,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.protocolFeeDestination,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.feeAccount,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.stakeAccountRecord,
      isWritable: false,
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
    {
      pubkey: accounts.stakeProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
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
