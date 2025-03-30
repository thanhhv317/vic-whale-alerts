const WALLET = {
  '0x7cb30740c7646afaa15295e6f2303e628dd9e5e5': 'Binance Hot Wallet',
  '0x39c9db7c1412041d084fed054fc9318b9f75acdb': 'Coin98 Stake V2',
  '0x71ebf8972459b01a50cca14ed351cf34213ed742': 'Rabbit Swap Router',
  '0x6f71ac3058ea167ffab93f7c14b5e2aee9276ce1': 'Bridge',
  '0x1db6ad727ae60d7b4dbee81f79c4bcbcff8759f8': 'Deployer',
  '0x0000000000000000000000000000000000000000': 'Zero'
}

export const formatAddress = (address, fromName = '') => {
  if (fromName) return fromName
  const addressLowerCase = address.toLowerCase()
  return WALLET[addressLowerCase] || `0x..${address.substring(address.length - 5)}`
}
