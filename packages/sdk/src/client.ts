import type { Address, BN, Program } from '@project-serum/anchor'
import type { PublicKey } from '@solana/web3.js'
import { SYSVAR_STAKE_HISTORY_PUBKEY, Transaction } from '@solana/web3.js'
import { web3 } from '@project-serum/anchor'
import type { Collateral, Liquidator, Manager, Oracle, Pool, User, Whitelist, WithdrawInfo } from './generated'
import {
  PROGRAM_ID,
  createAddLiquidatorInstruction,
  createAddManagerInstruction,
  createAddToWhitelistInstruction,
  createBlockUserInstruction,
  createBurnOmnisolInstruction,
  createCloseOracleInstruction,
  createClosePoolInstruction,
  createDepositLpInstruction,
  createDepositStakeInstruction,
  createInitOracleInstruction,
  createInitPoolInstruction,
  createLiquidateCollateralInstruction,
  createMintOmnisolInstruction,
  createPausePoolInstruction,
  createRemoveFromWhitelistInstruction,
  createRemoveLiquidatorInstruction,
  createRemoveManagerInstruction,
  createResumePoolInstruction,
  createUnblockUserInstruction,
  createUpdateOracleInfoInstruction, createWithdrawLpTokensInstruction, createWithdrawStakeInstruction,
} from './generated'
import { IDL } from './idl/omnisol'

const COLLATERAL_SEED_PREFIX = 'collateral'
const WHITELIST_SEED_PREFIX = 'whitelist'
const USER_SEED_PREFIX = 'user'
const MANAGER_SEED_PREFIX = 'manager'
const LIQUIDATOR_SEED_PREFIX = 'liquidator'
const WITHDRAW_INFO_PREFIX = 'withdraw_info'
const MINT_AUTHORITY_PREFIX = 'mint_authority'

export class OmnisolClient {
  static programId = PROGRAM_ID
  static IDL = IDL
  static clock = web3.SYSVAR_CLOCK_PUBKEY
  static stakeProgram = web3.StakeProgram.programId

  constructor(private readonly props: OmnisolClientProps) {}

  get program() {
    return this.props.program
  }

  get wallet() {
    return this.props.wallet
  }

  get pda() {
    return new OmnisolPDA()
  }

  async fetchGlobalPool(address: Address) {
    return await this.program.account.pool.fetchNullable(address) as unknown as Pool
  }

  async fetchWhitelist(address: Address) {
    return await this.program.account.whitelist.fetchNullable(address) as unknown as Whitelist
  }

  async fetchUser(address: Address) {
    return await this.program.account.user.fetchNullable(address) as unknown as User
  }

  async fetchCollateral(address: Address) {
    return await this.program.account.collateral.fetchNullable(address) as unknown as Collateral
  }

  async fetchManager(address: Address) {
    return await this.program.account.manager.fetchNullable(address) as unknown as Manager
  }

  async fetchOracle(address: Address) {
    return await this.program.account.oracle.fetchNullable(address) as unknown as Oracle
  }

  async fetchLiquidator(address: Address) {
    return await this.program.account.liquidator.fetchNullable(address) as unknown as Liquidator
  }

  async fetchWithdrawInfo(address: Address) {
    return await this.program.account.withdrawInfo.fetchNullable(address) as unknown as WithdrawInfo
  }

  async getCurrentRate(address: Address) {
    return (await this.fetchUser(address)).rate
  }

  async getLiquidationRate(address: Address) {
    const oracle = await this.fetchOracle(address)
    const queueMember = oracle.priorityQueue.at(0)
    if (queueMember === undefined) {
      return undefined
    }
    const collateral = await this.fetchCollateral(queueMember.collateral)
    const user = await this.fetchUser(collateral.user)
    return user.rate
  }

  async findCollaterals() {
    return await this.program.account.collateral.all()
  }

  async findUserCollaterals(user: web3.PublicKey) {
    const accounts = await this.program.account.collateral.all()
    return accounts.filter(a => a.account.user.toBase58() === user.toBase58())
  }

  async findPoolCollaterals(pool: web3.PublicKey) {
    const accounts = await this.program.account.collateral.all()
    return accounts.filter(a => a.account.pool.toBase58() === pool.toBase58())
  }

  async findUsers() {
    return await this.program.account.user.all()
  }

  async createPool(props: CreatePoolProps) {
    const payer = this.wallet.publicKey
    const pool = props.pool
    const stakeSource = props.stakeSource
    const [poolAuthority, bump] = await this.pda.poolAuthority(pool)
    const [mintAuthority] = await this.pda.mintAuthority()
    const ix = createInitPoolInstruction(
      {
        authority: payer,
        mintAuthority,
        oracle: props.oracle,
        pool,
        poolAuthority,
        poolMint: props.mint,
        stakeSource,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      poolAuthority,
      bump,
      stakeSource,
    }
  }

  async addManager(props: AddManagerProps) {
    const payer = this.wallet.publicKey
    const [manager] = await this.pda.manager(props.managerWallet)
    const instruction = createAddManagerInstruction(
      {
        authority: payer,
        manager,
        managerWallet: props.managerWallet,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
      manager,
    }
  }

  async removeManager(props: RemoveManagerProps) {
    const payer = this.wallet.publicKey
    const [manager] = await this.pda.manager(props.managerWallet)
    const instruction = createRemoveManagerInstruction(
      {
        authority: payer,
        manager,
        managerWallet: props.managerWallet,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
      manager,
    }
  }

  async closePool(props: ClosePoolProps) {
    const payer = this.wallet.publicKey
    const instruction = createClosePoolInstruction(
      {
        pool: props.pool,
        authority: payer,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
    }
  }

  async pausePool(props: PausePoolProps) {
    const payer = this.wallet.publicKey
    const [manager] = await this.pda.manager(payer)
    const instruction = createPausePoolInstruction(
      {
        manager,
        pool: props.pool,
        authority: payer,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
    }
  }

  async resumePool(props: ResumePoolProps) {
    const payer = this.wallet.publicKey
    const [manager] = await this.pda.manager(payer)
    const instruction = createResumePoolInstruction(
      {
        manager,
        pool: props.pool,
        authority: payer,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
    }
  }

  async addToWhitelist(props: AddToWhitelistProps) {
    const payer = this.wallet.publicKey
    const [whitelist] = await this.pda.whitelist(props.token)
    const [manager] = await this.pda.manager(payer)
    const instruction = createAddToWhitelistInstruction(
      {
        addressToWhitelist: props.token,
        authority: payer,
        manager,
        whitelist,
        pool: props.tokenPool,
        stakingPool: props.stakePool,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
      whitelist,
    }
  }

  async removeFromWhitelist(props: RemoveFromWhitelistProps) {
    const payer = this.wallet.publicKey
    const [whitelist] = await this.pda.whitelist(props.token)
    const [manager] = await this.pda.manager(payer)
    const instruction = createRemoveFromWhitelistInstruction(
      {
        addressToWhitelist: props.token,
        authority: payer,
        manager,
        whitelist,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
    }
  }

  async blockUser(props: BlockUserProps) {
    const payer = this.wallet.publicKey
    const [user] = await this.pda.user(props.userWallet)
    const [manager] = await this.pda.manager(payer)
    const instruction = createBlockUserInstruction(
      {
        authority: payer,
        manager,
        user,
        userWallet: props.userWallet,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
      user,
    }
  }

  async unblockUser(props: UnblockUserProps) {
    const payer = this.wallet.publicKey
    const [user] = await this.pda.user(props.userWallet)
    const [manager] = await this.pda.manager(payer)
    const instruction = createUnblockUserInstruction(
      {
        authority: payer,
        manager,
        user,
        userWallet: props.userWallet,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
      user,
    }
  }

  async depositLPToken(props: DepositLPTokenProps) {
    const payer = this.wallet.publicKey
    const [poolAuthority] = await this.pda.poolAuthority(props.pool)
    const [user] = await this.pda.user(payer)
    const [whitelist] = await this.pda.whitelist(props.lpToken)
    const [collateral, bump] = await this.pda.collateral(props.lpToken, user)
    const instruction = createDepositLpInstruction(
      {
        authority: payer,
        clock: OmnisolClient.clock,
        collateral,
        destination: props.destination,
        lpToken: props.lpToken,
        pool: props.pool,
        poolAuthority,
        source: props.source,
        user,
        whitelist,
      },
      {
        amount: props.amount,
      },
    )
    const tx = new Transaction().add(instruction)

    return {
      tx,
      collateral,
      user,
      bump,
    }
  }

  async depositStake(props: DepositStakeProps) {
    const payer = this.wallet.publicKey
    const [poolAuthority] = await this.pda.poolAuthority(props.pool)
    const [user] = await this.pda.user(payer)
    const [collateral, bump] = await this.pda.collateral(props.delegatedStake, user)
    const instruction = createDepositStakeInstruction(
      {
        delegatedStake: props.delegatedStake,
        authority: payer,
        clock: OmnisolClient.clock,
        collateral,
        pool: props.pool,
        poolAuthority,
        sourceStake: props.sourceStake,
        stakeProgram: OmnisolClient.stakeProgram,
        user,
        splitStake: props.splitStake,
      },
      {
        amount: props.amount,
      },
    )
    const transaction = new Transaction().add(instruction)

    return {
      transaction,
      user,
      collateral,
      bump,
    }
  }

  async mintOmnisol(props: MintOmnisolProps) {
    const payer = this.wallet.publicKey
    const [mintAuthority] = await this.pda.mintAuthority()
    const [user] = await this.pda.user(payer)
    const [collateral] = await this.pda.collateral(props.stakedAddress, user)
    const instruction = createMintOmnisolInstruction(
      {
        mintAuthority,
        authority: payer,
        clock: OmnisolClient.clock,
        collateral,
        pool: props.pool,
        poolMint: props.poolMint,
        stakedAddress: props.stakedAddress,
        user,
        userPoolToken: props.userPoolToken,
      },
      {
        amount: props.amount,
      },
    )
    const transaction = new Transaction().add(instruction)

    return {
      transaction,
      user,
      collateral,
    }
  }

  async withdrawLPTokens(props: WithdrawLPProps) {
    const payer = this.wallet.publicKey
    const [poolAuthority] = await this.pda.poolAuthority(props.pool)
    const [user] = await this.pda.user(payer)
    const [collateral] = await this.pda.collateral(props.lpToken, user)
    const instruction = createWithdrawLpTokensInstruction(
      {
        destination: props.destination,
        source: props.source,
        authority: payer,
        clock: OmnisolClient.clock,
        collateral,
        pool: props.pool,
        poolAuthority,
        poolMint: props.poolMint,
        lpToken: props.lpToken,
        user,
        userPoolToken: props.userPoolToken,
      },
      {
        amount: props.amount,
        withBurn: props.withBurn,
      },
    )
    const transaction = new Transaction().add(instruction)

    return {
      transaction,
      user,
      collateral,
    }
  }

  async withdrawStake(props: WithdrawStakeProps) {
    const payer = this.wallet.publicKey
    const [poolAuthority] = await this.pda.poolAuthority(props.pool)
    const [user] = await this.pda.user(payer)
    const [collateral] = await this.pda.collateral(props.delegatedStake, user)
    const stakeProgram = props.stakeProgram ?? web3.StakeProgram.programId
    const stakeHistory = props.stakeHistory ?? web3.SYSVAR_STAKE_HISTORY_PUBKEY
    const mergableStake = props.mergableStake ?? props.stakeAccount
    const instruction = createWithdrawStakeInstruction(
      {
        mergableStake,
        stakeHistory,
        authority: payer,
        clock: OmnisolClient.clock,
        collateral,
        pool: props.pool,
        poolAuthority,
        poolMint: props.poolMint,
        sourceStake: props.stakeAccount,
        delegatedStake: props.delegatedStake,
        splitStake: props.splitStake,
        stakeProgram,
        user,
        userPoolToken: props.userPoolToken,
      },
      {
        withMerge: props.withMerge,
        amount: props.amount,
        withBurn: props.withBurn,
      },
    )
    const transaction = new Transaction().add(instruction)

    return {
      transaction,
      user,
      collateral,
    }
  }

  async initOracle(props: InitOracleProps) {
    const payer = this.wallet.publicKey

    const ix = createInitOracleInstruction(
      {
        authority: payer,
        oracle: props.oracle,
        oracleAuthority: props.oracleAuthority,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
    }
  }

  async closeOracle(props: CloseOracleProps) {
    const payer = this.wallet.publicKey
    const ix = createCloseOracleInstruction(
      {
        authority: payer,
        oracle: props.oracle,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
    }
  }

  async addLiquidator(props: AddLiquidatorProps) {
    const payer = this.wallet.publicKey
    const liquidator_wallet = props.liquidator_wallet
    const [liquidator] = await this.pda.liquidator(liquidator_wallet)
    const [manager] = await this.pda.manager(payer)
    const ix = createAddLiquidatorInstruction(
      {
        authority: payer,
        liquidator,
        manager,
        walletOfLiquidator: liquidator_wallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      liquidator,
    }
  }

  async removeLiquidator(props: RemoveLiquidatorProps) {
    const payer = this.wallet.publicKey
    const liquidator_wallet = props.liquidator_wallet
    const [liquidator] = await this.pda.liquidator(liquidator_wallet)
    const [manager] = await this.pda.manager(payer)
    const ix = createRemoveLiquidatorInstruction(
      {
        authority: payer,
        liquidator,
        manager,
        walletOfLiquidator: liquidator_wallet,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      liquidator,
    }
  }

  async updateOracleInfo(props: UpdateOracleInfoProps) {
    const payer = this.wallet.publicKey
    const ix = createUpdateOracleInfoInstruction(
      {
        authority: payer,
        oracle: props.oracle,
      },
      {
        addresses: props.addresses,
        values: props.values,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
    }
  }

  async burnOmnisol(props: BurnOmnisolProps) {
    const payer = this.wallet.publicKey
    const [user] = await this.pda.user(payer)
    const userData = await this.fetchUser(user)
    const withdrawIndex = userData.lastWithdrawIndex === undefined ? 0 : userData.lastWithdrawIndex
    const [withdrawInfo] = await this.pda.withdrawInfo(payer, withdrawIndex + 1)
    const ix = createBurnOmnisolInstruction(
      {
        authority: payer,
        clock: OmnisolClient.clock,
        pool: props.pool,
        poolMint: props.poolMint,
        sourceTokenAccount: props.sourceTokenAccount,
        user,
        withdrawInfo,
      },
      {
        amount: props.amount,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      user,
      withdrawInfo,
    }
  }

  async liquidateCollateral(props: LiquidateCollateralProps) {
    const payer = this.wallet.publicKey
    const userWallet = props.userWallet
    const collateralOwnerWallet = props.collateralOwnerWallet
    const pool = props.pool

    const [collateralOwner] = await this.pda.user(collateralOwnerWallet)
    const [user] = await this.pda.user(userWallet)
    const [collateral] = await this.pda.collateral(props.sourceStake, collateralOwner)
    const [poolAuthority] = await this.pda.poolAuthority(pool)
    const [liquidator] = await this.pda.liquidator(payer)

    const userData = await this.fetchUser(user)
    const withdrawIndex = userData.lastWithdrawIndex - userData.requestsAmount + 1
    const [withdrawInfo] = await this.pda.withdrawInfo(payer, withdrawIndex)

    const collateralData = await this.fetchCollateral(collateral)
    let anchorRemainingAccounts: web3.AccountMeta[]
    if (collateralData.isNative) {
      const splitStake = props.splitStake ?? web3.Keypair.generate().publicKey
      anchorRemainingAccounts = [{
        pubkey: splitStake,
        isWritable: true,
        isSigner: true,
      }]
    } else {
      const stakePool = props.stakePool ?? web3.Keypair.generate().publicKey
      const stakePoolWithdrawAuthority = props.stakePoolWithdrawAuthority ?? web3.Keypair.generate().publicKey
      const reserveStakeAccount = props.reserveStakeAccount ?? web3.Keypair.generate().publicKey
      const managerFeeAccount = props.managerFeeAccount ?? web3.Keypair.generate().publicKey
      const stakeHistory = SYSVAR_STAKE_HISTORY_PUBKEY
      const validatorListStorage = props.validatorListStorage ?? web3.Keypair.generate().publicKey
      const stakeToSplit = props.stakeToSplit ?? web3.Keypair.generate().publicKey
      const splitStake = props.splitStake ?? web3.Keypair.generate().publicKey
      const poolTokenAccount = props.poolTokenAccount ?? web3.Keypair.generate().publicKey

      anchorRemainingAccounts = [
        {
          pubkey: stakePool,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: stakePoolWithdrawAuthority,
          isWritable: false,
          isSigner: false,
        },
        {
          pubkey: reserveStakeAccount,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: managerFeeAccount,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: stakeHistory,
          isWritable: false,
          isSigner: false,
        },
        {
          pubkey: validatorListStorage,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: stakeToSplit,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: splitStake,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: poolTokenAccount,
          isWritable: true,
          isSigner: false,
        },
      ]
    }
    const ix = createLiquidateCollateralInstruction(
      {
        authority: payer,
        clock: OmnisolClient.clock,
        collateral,
        collateralOwner,
        collateralOwnerWallet,
        feeAccount: props.feeAccount,
        liquidator,
        oracle: props.oracle,
        pool,
        poolAccount: props.poolAccount,
        poolAuthority,
        protocolFee: props.protocolFee,
        protocolFeeDestination: props.protocolFeeDestination,
        solReserves: props.solReserves,
        sourceStake: props.sourceStake,
        stakeAccountRecord: props.stakeAccountRecord,
        stakeProgram: OmnisolClient.stakeProgram,
        user,
        userWallet,
        withdrawInfo,
        anchorRemainingAccounts,
        unstakeItProgram: props.unstakeItProgram,
      },
      {
        amount: props.amount,
      },
    )
    const tx = new Transaction().add(ix)

    return {
      tx,
      user,
      withdrawInfo,
      collateral,
      pool,
    }
  }
}

class OmnisolPDA {
  poolAuthority = (pool: Address) => this.pda([
    new web3.PublicKey(pool).toBuffer(),
  ])

  mintAuthority = () => this.pda([
    Buffer.from(MINT_AUTHORITY_PREFIX),
  ])

  whitelist = (token: Address) => this.pda([
    Buffer.from(WHITELIST_SEED_PREFIX),
    new web3.PublicKey(token).toBuffer(),
  ])

  user = (user_wallet: Address) => this.pda([
    Buffer.from(USER_SEED_PREFIX),
    new web3.PublicKey(user_wallet).toBuffer(),
  ])

  collateral = (sourceStake: Address, user: Address) => this.pda([
    Buffer.from(COLLATERAL_SEED_PREFIX),
    new web3.PublicKey(user).toBuffer(),
    new web3.PublicKey(sourceStake).toBuffer(),
  ])

  manager = (wallet: Address) => this.pda([
    Buffer.from(MANAGER_SEED_PREFIX),
    new web3.PublicKey(wallet).toBuffer(),
  ])

  liquidator = (wallet: Address) => this.pda([
    Buffer.from(LIQUIDATOR_SEED_PREFIX),
    new web3.PublicKey(wallet).toBuffer(),
  ])

  withdrawInfo = (wallet: Address, index: number) => this.pda([
    Buffer.from(WITHDRAW_INFO_PREFIX),
    new web3.PublicKey(wallet).toBuffer(),
    toLeInt32Bytes(index),
  ])

  private async pda(seeds: Array<Buffer | Uint8Array>) {
    return await web3.PublicKey.findProgramAddress(seeds, OmnisolClient.programId)
  }
}

export function toLeInt32Bytes(num: number) {
  return new Uint8Array([
    (num & 0x000000FF),
    (num & 0x0000FF00) >> 8,
    (num & 0x00FF0000) >> 16,
    (num & 0xFF000000) >> 24,
  ])
}

export interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

interface OmnisolClientProps {
  wallet: Wallet
  program: Program<typeof IDL>
}

interface CreatePoolProps {
  pool: PublicKey
  mint: PublicKey
  oracle: PublicKey
  stakeSource: PublicKey
}

interface ClosePoolProps {
  pool: PublicKey
}

interface PausePoolProps {
  pool: PublicKey
}

interface ResumePoolProps {
  pool: PublicKey
}

interface AddToWhitelistProps {
  tokenPool: PublicKey
  stakePool: PublicKey
  token: PublicKey
}

interface RemoveFromWhitelistProps {
  token: PublicKey
}

interface BlockUserProps {
  userWallet: PublicKey
}

interface UnblockUserProps {
  userWallet: PublicKey
}

interface DepositLPTokenProps {
  pool: PublicKey
  lpToken: PublicKey
  source: PublicKey
  destination: PublicKey
  amount: BN
}

interface DepositStakeProps {
  pool: PublicKey
  sourceStake: PublicKey
  splitStake: PublicKey
  delegatedStake: PublicKey
  amount: BN
}

interface MintOmnisolProps {
  pool: PublicKey
  poolMint: PublicKey
  userPoolToken: PublicKey
  stakedAddress: PublicKey
  amount: BN
}

interface AddManagerProps {
  managerWallet: PublicKey
}

interface RemoveManagerProps {
  managerWallet: PublicKey
}

interface WithdrawLPProps {
  pool: PublicKey
  poolMint: PublicKey
  userPoolToken: PublicKey
  lpToken: PublicKey
  source: PublicKey
  destination: PublicKey
  amount: BN
  withBurn: boolean
}

interface WithdrawStakeProps {
  pool: PublicKey
  poolMint: PublicKey
  userPoolToken: PublicKey
  stakeAccount: PublicKey
  delegatedStake: PublicKey
  mergableStake?: PublicKey
  splitStake: PublicKey
  stakeHistory?: PublicKey
  stakeProgram?: PublicKey
  amount: BN
  withBurn: boolean
  withMerge: boolean
}

interface InitOracleProps {
  oracle: PublicKey
  oracleAuthority: PublicKey
}

interface CloseOracleProps {
  oracle: PublicKey
}

interface AddLiquidatorProps {
  liquidator_wallet: PublicKey
}

interface RemoveLiquidatorProps {
  liquidator_wallet: PublicKey
}

interface UpdateOracleInfoProps {
  oracle: PublicKey
  addresses: PublicKey[]
  values: BN[]
}

interface BurnOmnisolProps {
  pool: PublicKey
  poolMint: PublicKey
  sourceTokenAccount: PublicKey
  amount: BN
}

interface LiquidateCollateralProps {
  pool: PublicKey
  sourceStake: PublicKey
  collateralOwnerWallet: PublicKey
  userWallet: PublicKey
  oracle: PublicKey
  poolAccount: PublicKey
  solReserves: PublicKey
  protocolFee: PublicKey
  protocolFeeDestination: PublicKey
  feeAccount: PublicKey
  stakeAccountRecord: PublicKey
  unstakeItProgram: PublicKey
  splitStake?: PublicKey
  stakePool?: PublicKey
  stakePoolWithdrawAuthority?: PublicKey
  reserveStakeAccount?: PublicKey
  managerFeeAccount?: PublicKey
  validatorListStorage?: PublicKey
  stakeToSplit?: PublicKey
  poolTokenAccount?: PublicKey
  amount: BN
}
