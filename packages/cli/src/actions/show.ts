import { web3 } from '@project-serum/anchor'
import log from 'loglevel'
import { useContext } from '../context'

export async function showPool(address: string) {
  const { client, cluster } = useContext()

  const [poolAuthorityKey] = await client.pda.poolAuthority(address)
  const pool = await client.fetchGlobalPool(address)

  log.info('--------------------------------------------------------------------------')
  log.info(`Pool: ${address}`)
  log.info(`Pool authority: ${poolAuthorityKey}`)
  log.info(`Pool mint: ${pool.poolMint}`)
  log.info(`Oracle: ${pool.oracle}`)
  log.info(`Stake source: ${pool.stakeSource}`)
  log.info(`Authority: ${pool.authority}`)
  log.info(`Deposit amount: ${pool.depositAmount}`)
  log.info(`Is active: ${pool.isActive}`)
  log.info(`Authority bump: ${pool.authorityBump}`)
  const accounts = await client.findPoolCollaterals(new web3.PublicKey(address))
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`Collateral: ${account.publicKey}`)
    if (account.account.isNative) {
      log.info(`Delegated stake: ${account.account.delegatedStake}`)
    } else {
      log.info(`LP token: ${account.account.sourceStake}`)
    }
    log.info(`See all info: "pnpm cli -c ${cluster} collateral show ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}

export async function showLiquidator(address: string) {
  const { client } = useContext()

  const [liquidatorKey] = await client.pda.liquidator(address)
  const liquidator = await client.fetchLiquidator(liquidatorKey)

  log.info('--------------------------------------------------------------------------')
  log.info(`PDA address: ${liquidatorKey}`)
  log.info(`Liquidator authority: ${liquidator.authority}`)
  log.info('--------------------------------------------------------------------------')
}

export async function showManager(address: string) {
  const { client } = useContext()

  const [managerKey] = await client.pda.manager(address)
  const manager = await client.fetchManager(managerKey)

  log.info('--------------------------------------------------------------------------')
  log.info(`PDA address: ${managerKey}`)
  log.info(`Manager wallet: ${manager.manager}`)
  log.info('--------------------------------------------------------------------------')
}

export async function showWhitelist(address: string) {
  const { client } = useContext()

  const [whitelistKey] = await client.pda.whitelist(address)
  const whitelist = await client.fetchWhitelist(whitelistKey)

  log.info('--------------------------------------------------------------------------')
  log.info(`Whitelist pda: ${whitelistKey}`)
  log.info(`Pool: ${whitelist.pool}`)
  log.info(`Token address: ${whitelist.whitelistedToken}`)
  log.info(`Staking pool: ${whitelist.stakingPool}`)
  log.info('--------------------------------------------------------------------------')
}

export async function findUser(address: string) {
  const { client } = useContext()

  const [userKey] = await client.pda.user(address)
  await showUser(userKey.toString())
}

export async function showUser(userAddress: string) {
  const { client, cluster } = useContext()

  const user = await client.fetchUser(userAddress)

  log.info('--------------------------------------------------------------------------')
  log.info(`User pda: ${userAddress}`)
  log.info(`User wallet: ${user.wallet}`)
  log.info(`User rate: ${user.rate}`)
  log.info(`User withdraw requests amount: ${user.requestsAmount}`)
  log.info(`Last withdraw request index: ${user.lastWithdrawIndex}`)
  log.info(`Is blocked: ${user.isBlocked}`)
  const collaterals = await client.findUserCollaterals(new web3.PublicKey(userAddress))
  const keys = collaterals.map(collateral => collateral.publicKey)
  log.info(`Collaterals owned by user: ${keys}`)
  log.info(`See all info about collateral: "pnpm cli -c ${cluster} collateral show ` + '<COLLATERAL_ADDRESS>"')
  log.info('--------------------------------------------------------------------------')
}

export async function showUsers() {
  const { client, cluster } = useContext()

  const accounts = await client.findUsers()
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`User pda: ${account.publicKey}`)
    log.info(`User wallet: ${account.account.wallet}`)
    const collaterals = await client.findUserCollaterals(account.publicKey)
    let amount = 0
    collaterals.forEach(collateral => amount += +collateral.account.amount)
    log.info(`Omnisol minted: ${amount}`)
    log.info(`See all info: "pnpm cli -c ${cluster} user show ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}

export async function showOracle(address: string) {
  const { client } = useContext()

  const oracle = await client.fetchOracle(address)

  log.info('--------------------------------------------------------------------------')
  log.info(`Oracle: ${address}`)
  log.info(`\nPriority queue: \n${JSON.stringify(oracle.priorityQueue, null, 2)}\n`)
  log.info('--------------------------------------------------------------------------')
}

export async function findCollateral(sourceStake: string, user: string) {
  const { client } = useContext()

  const [collateralKey] = await client.pda.collateral(sourceStake, user)
  showCollateral(collateralKey.toString())
}

export async function showCollateral(collateralAddress: string) {
  const { client } = useContext()

  const collateral = await client.fetchCollateral(collateralAddress)
  const rest_to_mint = +collateral.delegationStake - +collateral.amount

  log.info('--------------------------------------------------------------------------')
  log.info(`User pda: ${collateral.user}`)
  log.info(`Pool: ${collateral.pool}`)
  log.info(`Delegated amount: ${collateral.delegationStake}`)
  log.info(`Minted amount: ${collateral.amount}`)
  log.info(`Liquidated amount: ${collateral.liquidatedAmount}`)
  log.info(`Can be minted: ${rest_to_mint}`)
  log.info(`Address of lp token or native stake account deposited: ${collateral.sourceStake}`)
  if (collateral.isNative) {
    log.info(`Delegated stake account: ${collateral.delegatedStake}`)
  }
  log.info(`Is native stake: ${collateral.isNative}`)
  log.info(`Created at: ${collateral.createdAt}`)
  log.info('--------------------------------------------------------------------------')
}

export async function showCollaterals() {
  const { client, cluster } = useContext()

  const accounts = await client.findCollaterals()
  for (const account of accounts) {
    log.info('--------------------------------------------------------------------------')
    log.info(`Collateral pda: ${account.publicKey}`)
    const user = await client.fetchUser(account.account.user)
    log.info(`User wallet: ${user.wallet}`)
    if (account.account.isNative) {
      log.info(`Delegated stake: ${account.account.delegatedStake}`)
    } else {
      log.info(`LP token: ${account.account.sourceStake}`)
    }
    log.info(`See all info: "pnpm cli -c ${cluster} collateral show ${account.publicKey}"`)
  }
  log.info('--------------------------------------------------------------------------')
}

export async function showWithdrawInfo(address: string, index: string) {
  const { client } = useContext()

  const [withdrawKey] = await client.pda.withdrawInfo(address, Number(index))
  const withdraw = await client.fetchWithdrawInfo(withdrawKey)

  log.info('--------------------------------------------------------------------------')
  log.info(`Withdraw request pda: ${withdrawKey}`)
  log.info(`User wallet: ${withdraw.authority}`)
  log.info(`Amount to liquidate: ${withdraw.amount}`)
  log.info(`Created at: ${withdraw.createdAt}`)
  log.info('--------------------------------------------------------------------------')
}
