/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category CloseOracle
 * @category generated
 */
export const closeOracleStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'CloseOracleInstructionArgs',
)
/**
 * Accounts required by the _closeOracle_ instruction
 *
 * @property [] pool
 * @property [_writable_, **signer**] authority
 * @property [_writable_] oracle
 * @category Instructions
 * @category CloseOracle
 * @category generated
 */
export interface CloseOracleInstructionAccounts {
  pool: web3.PublicKey
  authority: web3.PublicKey
  oracle: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const closeOracleInstructionDiscriminator = [
  74, 239, 49, 223, 206, 52, 189, 123,
]

/**
 * Creates a _CloseOracle_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category CloseOracle
 * @category generated
 */
export function createCloseOracleInstruction(
  accounts: CloseOracleInstructionAccounts,
  programId = new web3.PublicKey('9SfbhzHrx5xczfoiTo2VVpG5oukcS5Schgy2ppLH3zQd'),
) {
  const [data] = closeOracleStruct.serialize({
    instructionDiscriminator: closeOracleInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.pool,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.oracle,
      isWritable: true,
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
