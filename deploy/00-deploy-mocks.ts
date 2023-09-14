import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { developmentChains, networkConfig } from '../helper.hardhat.config'
import { ethers, network } from 'hardhat'

const BASE_FEE = ethers.utils.parseEther('0.25')
const GAS_PRICE_LINK = 1e9

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const agrs = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log('Local network detected! Deploying mocks')
        // deploy mock vrfconditions
        await deploy('VRFCoordinatorV2Mock', {
            from: deployer,
            log: true,
            args: agrs,
        })
        log('---------------- Mock Deploy Done ---------------------')
    }
}

export default deployMocks
deployMocks.tags = ['all', 'mocks']
