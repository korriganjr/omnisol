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
 * @category ResumePool
 * @category generated
 */
export const resumePoolStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'ResumePoolInstructionArgs',
)
/**
 * Accounts required by the _resumePool_ instruction
 *
 * @property [_writable_] pool
 * @property [_writable_] manager
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category ResumePool
 * @category generated
 */
export interface ResumePoolInstructionAccounts {
  pool: web3.PublicKey
  manager: web3.PublicKey
  authority: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const resumePoolInstructionDiscriminator = [
  52, 182, 28, 44, 146, 165, 190, 119,
]

/**
 * Creates a _ResumePool_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category ResumePool
 * @category generated
 */
export function createResumePoolInstruction(
  accounts: ResumePoolInstructionAccounts,
  programId = new web3.PublicKey('6sccaGNYx7RSjVgFD13UKE7dyUiNavr2KXgeqaQvZUz7'),
) {
  const [data] = resumePoolStruct.serialize({
    instructionDiscriminator: resumePoolInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.pool,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.manager,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
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
