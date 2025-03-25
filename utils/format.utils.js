const WALLET = {
  '0x7cb30740c7646afaa15295e6f2303e628dd9e5e5': 'Binance Hot Wallet',
  '0x39c9db7c1412041d084fed054fc9318b9f75acdb': 'Coin98 Stake V2'
}

export const formatAddress = (address, fromName = '') => {
  if (fromName) return fromName
  const addressLowerCase = address.toLowerCase()
  return WALLET[addressLowerCase] || `0x..${address.substring(address.length - 5)}`
}
