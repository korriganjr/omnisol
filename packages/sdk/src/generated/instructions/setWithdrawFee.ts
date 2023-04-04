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
 * @category SetWithdrawFee
 * @category generated
 */
export interface SetWithdrawFeeInstructionArgs {
  fee: number
}
/**
 * @category Instructions
 * @category SetWithdrawFee
 * @category generated
 */
export const setWithdrawFeeStruct = new beet.BeetArgsStruct<
  SetWithdrawFeeInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['fee', beet.u8],
  ],
  'SetWithdrawFeeInstructionArgs',
)
/**
 * Accounts required by the _setWithdrawFee_ instruction
 *
 * @property [_writable_] pool
 * @property [_writable_] manager
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category SetWithdrawFee
 * @category generated
 */
export interface SetWithdrawFeeInstructionAccounts {
  pool: web3.PublicKey
  manager: web3.PublicKey
  authority: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const setWithdrawFeeInstructionDiscriminator = [
  33, 223, 102, 118, 225, 116, 8, 238,
]

/**
 * Creates a _SetWithdrawFee_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetWithdrawFee
 * @category generated
 */
export function createSetWithdrawFeeInstruction(
  accounts: SetWithdrawFeeInstructionAccounts,
  args: SetWithdrawFeeInstructionArgs,
  programId = new web3.PublicKey('6sccaGNYx7RSjVgFD13UKE7dyUiNavr2KXgeqaQvZUz7'),
) {
  const [data] = setWithdrawFeeStruct.serialize({
    instructionDiscriminator: setWithdrawFeeInstructionDiscriminator,
    ...args,
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
