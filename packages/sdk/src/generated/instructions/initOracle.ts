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
 * @category InitOracle
 * @category generated
 */
export const initOracleStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'InitOracleInstructionArgs',
)
/**
 * Accounts required by the _initOracle_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_, **signer**] oracle
 * @property [] oracleAuthority
 * @category Instructions
 * @category InitOracle
 * @category generated
 */
export interface InitOracleInstructionAccounts {
  authority: web3.PublicKey
  oracle: web3.PublicKey
  oracleAuthority: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const initOracleInstructionDiscriminator = [
  78, 100, 33, 183, 96, 207, 60, 91,
]

/**
 * Creates a _InitOracle_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category InitOracle
 * @category generated
 */
export function createInitOracleInstruction(
  accounts: InitOracleInstructionAccounts,
  programId = new web3.PublicKey('6sccaGNYx7RSjVgFD13UKE7dyUiNavr2KXgeqaQvZUz7'),
) {
  const [data] = initOracleStruct.serialize({
    instructionDiscriminator: initOracleInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.oracle,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.oracleAuthority,
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
