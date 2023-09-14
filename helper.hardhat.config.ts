import { ethers } from 'hardhat'

export interface networkConfigItem {
    name?: string
    subscriptionId?: string
    gasLane?: string
    keepersUpdateInterval?: string
    raffleEntranceFee?: string
    callbackGasLimit?: string
    vrfCoordinatorV2?: string
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    11155111: {
        name: 'sepolia',
        vrfCoordinatorV2: '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625',
        raffleEntranceFee: ethers.utils.parseEther('0.01').toString(),
        gasLane: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
        subscriptionId: '588',
        callbackGasLimit: '500000',
        keepersUpdateInterval: '30',
    },
    31337: {
        name: 'hardhat',
        raffleEntranceFee: ethers.utils.parseEther('0.01').toString(),
        gasLane: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c',
        callbackGasLimit: '500000',
        keepersUpdateInterval: '30',
    },
}

export const developmentChains = ['hardhat', 'localhost']
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
