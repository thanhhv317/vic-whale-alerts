import Web3 from 'web3'
import dotenv from "dotenv";
import abi from './abi.c98.js'
import { RPC_URL } from './utils/constant.js'
import { getTokens } from './utils/tokens.js'
import { formatAddress, getTransactionDetail } from './utils/index.js'

dotenv.config();

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
let tokens = []

// information of token to tracking
const TOKENS_TO_WATCH = [
  {
    address: "0x0Fd0288AAAE91eaF935e2eC14b23486f86516c8C",
    symbol: "C98",
    decimals: 18,
    minAmount: web3.utils.toBigInt(web3.utils.toWei("40000", "ether")),
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
  },
  {
    address: "0x193fcbb7f9eea67cac0d5a94ec7ccf2141c867ec",
    symbol: "DADA",
    decimals: 18,
    minAmount: web3.utils.toBigInt(web3.utils.toWei("1", "ether")) // 1 token DADA
  },
  {
    address: "0x69b946132b4a6c74cd29ba3ff614ceea1ef9ff2b",
    symbol: "USDT",
    decimals: 18,
    minAmount: web3.utils.toBigInt(web3.utils.toWei("500", "ether")) // 500 token usdt
  }
];

let lastCheckedBlock;

const getLatestBlock = async () => {
  const currentBlock = await web3.eth.getBlockNumber();
  lastCheckedBlock = Number(currentBlock)
  console.log(`🔄 Start tracking from block: ${lastCheckedBlock}`);
};

const trackTokenTransfers = async (token) => {
  console.log(`tracking ${token.symbol} at ${Date.now()}...`)
  try {
    const latestBlock = await web3.eth.getBlockNumber();

    const events = await token.tokenContract.getPastEvents("Transfer", {
      fromBlock: lastCheckedBlock + 1,
      toBlock: latestBlock,
    });

    events.forEach(async (event) => {
      const { from, to, value } = event.returnValues;
      const amount = web3.utils.toBigInt(value);

      if (amount >= token.minAmount) {
  
        const response = await getTransactionDetail(event.transactionHash)
        const { fromName } = response

        const tkprice = tokens.find((tk) => token.address == tk.address)
        const amountNum = Math.floor(parseFloat(web3.utils.fromWei(amount, "ether")))
        const usdAmout = tkprice ?  Math.floor(tkprice.price * amountNum) : 0

        const msg =
          `🚀 Transfer *${amountNum.toLocaleString()}* ${token.symbol} ${(usdAmout ? `| $${usdAmout}` : '' )}
            from [${formatAddress(from, fromName)}](https://www.vicscan.xyz/address/${from}) 
            to [${formatAddress(to)}](https://www.vicscan.xyz/address/${to}).
          Check out this transaction [here](https://www.vicscan.xyz/tx/${event.transactionHash})`
        
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
  const CHANNEL_ID =process.env.TELEGRAM_CHANNEL_ID;  // or "-100xxxxxxxxx" if it's private channel
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
  tokens = await getTokens()
  setInterval(async () => {
    const tks = await getTokens()
    if (tks) {
      tokens = tks
    }
  }, 5 * 60 * 1000)

  setInterval(() => {
    console.log(`🔄 Start tracking from block: ${lastCheckedBlock}`);

    for (const token of TOKENS_TO_WATCH) {
      token['tokenContract'] = new web3.eth.Contract(abi, token.address);
      trackTokenTransfers(token);
    };
  }, 20000);
})();
