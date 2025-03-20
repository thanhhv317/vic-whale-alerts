import Web3 from 'web3'
import dotenv from "dotenv";
import abi from './abi.c98.js'

dotenv.config();
const RPC_URL = "https://rpc.viction.xyz"

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// information of token to tracking
const TOKENS_TO_WATCH = [
  {
    address: "0x0Fd0288AAAE91eaF935e2eC14b23486f86516c8C",
    symbol: "C98",
    decimals: 18,
    minAmount: web3.utils.toBigInt(web3.utils.toWei("100000", "ether")), 
  },
  {
    address: "0xB786D9c8120D311b948cF1e5Aa48D8fBacf477E2",
    symbol: "SAROS",
    decimals: 18, 
    minAmount: web3.utils.toBigInt(web3.utils.toWei("1000000", "ether")), // 1000K Token SAROS
    },
  {
    address: "0xc054751bdbd24ae713ba3dc9bd9434abe2abc1ce",
    symbol: "VIC",
    decimals: 18,
    minAmount: web3.utils.toBigInt(web3.utils.toWei("10000", "ether")), // 10K Token VIC
  }
];

let lastCheckedBlock;

const getLatestBlock = async () => {
  const currentBlock = await web3.eth.getBlockNumber();
  lastCheckedBlock = Number(currentBlock)
  console.log(`🔄 Start tracking from block: ${lastCheckedBlock}`);
};

const formatAddress = (address) => {
  return `0x..${address.substring(address.length - 5)}`
}

const trackTokenTransfers = async (token) => {
  console.log(`tracking ${token.symbol} at ${Date.now()}...`)
  try {
    const latestBlock = await web3.eth.getBlockNumber();

    const events = await token.tokenContract.getPastEvents("Transfer", {
      fromBlock: lastCheckedBlock + 1,
      toBlock: latestBlock,
    });

    events.forEach((event) => {
      const { from, to, value } = event.returnValues;
      const amount = web3.utils.toBigInt(value);

      if (amount >= token.minAmount) {
        const msg =
          `🚀 Transfer *${parseFloat(web3.utils.fromWei(amount, "ether")).toFixed(2)}* ${token.symbol} from [${formatAddress(from)}](https://www.vicscan.xyz/address/${from}) to [${formatAddress(to)}](https://www.vicscan.xyz/address/${to}).\nCheck out this transaction [here](https://www.vicscan.xyz/tx/${event.transactionHash})`
        sendToChannel(msg)
        return
        }
    });

    lastCheckedBlock = Number(latestBlock);
  } catch (error) {
    console.error("❌ Error when get Transfer event:", error);
  }
};

const sendToChannel = async (message) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
  const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;  // or "-100xxxxxxxxx" if it's private channel
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHANNEL_ID,
      text: message,
      parse_mode: "Markdown",
      disable_web_page_preview: true
    }),
  });

  const data = await res.json();
  console.log("📨 Telegram Channel Response:", data);
};

(async () => {
  await getLatestBlock();
  for (const token of TOKENS_TO_WATCH) {
    token['tokenContract'] =  new web3.eth.Contract(abi, token.address);
    setInterval(() => trackTokenTransfers(token), 60000)
  };
})();
