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
 * @category BlockUser
 * @category generated
 */
export const blockUserStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'BlockUserInstructionArgs',
)
/**
 * Accounts required by the _blockUser_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] manager
 * @property [_writable_] user
 * @property [] userWallet
 * @category Instructions
 * @category BlockUser
 * @category generated
 */
export interface BlockUserInstructionAccounts {
  authority: web3.PublicKey
  manager: web3.PublicKey
  user: web3.PublicKey
  userWallet: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const blockUserInstructionDiscriminator = [
  10, 164, 178, 6, 231, 175, 185, 191,
]

/**
 * Creates a _BlockUser_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category BlockUser
 * @category generated
 */
export function createBlockUserInstruction(
  accounts: BlockUserInstructionAccounts,
  programId = new web3.PublicKey('9SfbhzHrx5xczfoiTo2VVpG5oukcS5Schgy2ppLH3zQd'),
) {
  const [data] = blockUserStruct.serialize({
    instructionDiscriminator: blockUserInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.manager,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.user,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userWallet,
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
