# Yellow SDK Demo Application

A demonstration application showcasing the core capabilities of the Yellow SDK for building decentralized applications on the Yellow Network.

## 🚀 Features

- **WebSocket Connection**: Real-time connection to Yellow Network's ClearNet
- **EIP-712 Authentication**: Secure authentication using Ethereum's message signing standard
- **JWT Token Management**: Stateless session management with JSON Web Tokens
- **Session Creation**: Dynamic application session management
- **Transfer Simulation**: Mock cross-chain transfer operations
- **State Management**: Comprehensive application state tracking

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- An Ethereum wallet with private key access

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yellow-test_V1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your wallet**
   - Copy `env.example` to `.env`
   - Update the `WALLET_ADDRESS` and `PRIVATE_KEY` values in `.env`
   - **⚠️ Security Warning**: Never commit private keys to version control

## 🏃‍♂️ Usage

### Basic Usage

Run the demo application:

```bash
node index.js
```

### Expected Output

```
WebSocket connection established
📤 Enviando auth_request firmado: { ... }
🔐 Received auth challenge
✅ Authentication successful
🔑 JWT recibido: <jwt-token>

🚀 Starting Yellow SDK Demo...

📱 Creating app session...
✅ Session created: session_<timestamp>_<random>

💸 Simulating transfer...
📤 Transfer details:
   - From: 0xc49C5ec7D76984e3f1c48F5AfAb820aebe242c6b
   - To: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
   - Amount: 0.001 ETH
   - Time: 2024-01-20T10:30:00.000Z
✅ Transfer simulated successfully

📊 Session Information:
   - Session ID: session_<timestamp>_<random>
   - Authenticated: true
   - JWT Token: Present
   - Wallet Address: 0xc49C5ec7D76984e3f1c48F5AfAb820aebe242c6b
   - Network: Yellow Network (ClearNet)

🎉 Demo completed successfully!
```

## 🔧 Configuration

### Environment Variables (Required)

Create a `.env` file from the example:

```bash
cp env.example .env
```

Then edit `.env` with your values:

```env
WALLET_ADDRESS=0xYourWalletAddress
PRIVATE_KEY=0xYourPrivateKey
APP_NAME=your-app-name
YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
SESSION_EXPIRY=3600
```

### Customization

- **App Name**: Change the `APP_NAME` in your `.env` file
- **Scope**: Modify the `scope` parameter in the code for different access levels
- **Expiration**: Adjust the `SESSION_EXPIRY` for session duration
- **Transfer Data**: Customize the mock transfer parameters in the code

## 📁 Project Structure

```
yellow-test_V1/
├── index.js              # Main application file
├── package.json          # Dependencies and scripts
├── env.example          # Environment variables template
├── .env                 # Your environment variables (DO NOT COMMIT)
├── .gitignore          # Git ignore rules
├── SUMMARY.md          # SDK overview and features
├── GETTING_STARTED.md  # Detailed setup guide
└── README.md           # This file
```

## 🛡️ Security Considerations

- **Private Keys**: Never expose private keys in production code
- **Environment Variables**: Use environment variables for sensitive data
- **Network Security**: Ensure secure WebSocket connections in production
- **Token Management**: Implement proper JWT token storage and refresh logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the [GETTING_STARTED.md](./GETTING_STARTED.md) guide
- Review the [Yellow Network documentation](https://docs.yellow.ai)
- Open an issue in this repository

## 🔗 Related Links

- [Yellow Network Documentation](https://docs.yellow.ai)
- [ERC-7824 Standard](https://eips.ethereum.org/EIPS/eip-7824)
- [EIP-712 Standard](https://eips.ethereum.org/EIPS/eip-712)
- [Ethers.js Documentation](https://docs.ethers.io)
