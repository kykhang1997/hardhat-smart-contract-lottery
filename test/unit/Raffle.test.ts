import { deployments, ethers, getNamedAccounts, network } from 'hardhat'
import { developmentChains, networkConfig } from '../../helper.hardhat.config'
import { Raffle, VRFCoordinatorV2Mock } from '../../typechain-types'
import { assert, expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumberish, Contract } from 'ethers'

console.log('network', network.name, !developmentChains.includes(network.name))
!developmentChains.includes(network.name)
    ? describe.skip
    : describe('Raffle Unit Tests', function () {
          let raffle: any
          let raffleContract: Contract
          let vrfCoordinatorV2Mock: Contract
          let player: any
          let accounts: SignerWithAddress[]
          let raffleEntranceFee: BigNumberish
          let interval: number
          const chainId: number = network.config.chainId!

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              player = accounts[1]
              await deployments.fixture(['all'])
              raffle = await ethers.getContract('Raffle')
              vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock')
              raffleContract = await ethers.getContract('Raffle')
              raffle = raffleContract.connect(player)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = Number(await raffle.getInterval())
          })

          describe('constructor', function () {
              it('intitiallizes the raffle correctly', async () => {
                  // Ideally, we'd separate these out so that only 1 assert per "it" block
                  // And ideally, we'd make this check everything
                  const raffleState = String(await raffle.getRaffleState())
                  console.log('raffleState', raffleState)
                  assert.equal(raffleState, '0')
                  assert.equal(interval.toString(), networkConfig[chainId]['keepersUpdateInterval'])
              })
          })

          describe('enterRaffle', function () {
              it("reverts when you don't pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      'Raffle__NotEnoughETHEntered'
                  )
              })
              it('records player when they enter', async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const contractPlayer = await raffle.getPlayer(0)
                  assert.equal(player.address, contractPlayer)
              })
              it('emit event on enter', async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      'RaffleEnter'
                  )
              })
              it("doesn't allow entrance when raffle is calculating", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send('evm_increaseTime', [interval + 1])
                  await network.provider.request({ method: 'evm_mine', params: [] })

                  // we pretend to be a keeper for a second
                  await raffle.performUpkeep([])
                  console.log('interval', interval)

                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      'Raffle__RaffleNotOpen'
                  )
              })
          })
      })
