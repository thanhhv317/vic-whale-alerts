# VIC Whale Alert

## Overview
VIC Whale Alert is a monitoring tool designed to track large token transactions on the Viction blockchain. The tool watches for significant price fluctuations of tokens listed in `TOKENS_TO_WATCH` and sends alerts to a designated Telegram channel via a bot.

## Features
- Monitors token transactions on the Viction blockchain.
- Sends real-time alerts to a Telegram channel.
- Configurable token watchlist via `TOKENS_TO_WATCH`.

## Requirements
- Node.js (version 18 or later)
- Web3.js
- Telegram Bot API token

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/vic-whale-alert.git
   cd vic-whale-alert
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure it:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHANNEL_ID=@your_telegram_channel_id
   PROVIDER_URL=https://rpc.viction.xyz
   ```

## Usage
Run the script to start monitoring transactions:
```bash
npm start
```

## Contributing
Feel free to submit issues or pull requests to improve this project.

## License
This project is licensed under the MIT License.