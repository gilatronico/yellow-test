# Getting Started with Yellow SDK

Welcome to the Yellow SDK! This guide will walk you through setting up your development environment, understanding the core concepts, and building your first decentralized application on the Yellow Network.

## 🎯 What You'll Learn

By the end of this guide, you'll have:
- A working Yellow SDK integration
- Understanding of EIP-712 authentication
- Knowledge of WebSocket communication with Yellow Network
- A foundation for building more complex DApps

## 📋 Prerequisites

Before diving in, ensure you have:

### Required Software
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- A **code editor** (VS Code recommended)

### Required Knowledge
- Basic JavaScript/TypeScript
- Understanding of blockchain concepts
- Familiarity with WebSocket connections
- Basic knowledge of Ethereum wallets

## 🚀 Quick Start

### Step 1: Project Setup

Create a new project directory and initialize it:

```bash
mkdir my-yellow-dapp
cd my-yellow-dapp
npm init -y
```

### Step 2: Install Dependencies

Install the Yellow SDK and required packages:

```bash
npm install @erc7824/nitrolite ethers ws
```

### Step 3: Environment Configuration

Create a `.env` file for secure configuration:

```bash
cp env.example .env
```

Edit `.env` with your values:

```env
WALLET_ADDRESS=0xYourWalletAddress
PRIVATE_KEY=0xYourPrivateKey
APP_NAME=my-yellow-dapp
YELLOW_WS_ENDPOINT=wss://clearnet.yellow.com/ws
SESSION_EXPIRY=3600
```

### Step 4: Basic Implementation

Create an `index.js` file with the following structure:

```javascript
import WebSocket from 'ws';
import nitrolite from '@erc7824/nitrolite';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import SDK functions
const {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createEIP712AuthMessageSigner,
  RPCMethod,
} = nitrolite;

// Configuration from environment
const WALLET = process.env.WALLET_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Validate configuration
if (!WALLET || !PRIVATE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const ws = new WebSocket(process.env.YELLOW_WS_ENDPOINT || 'wss://clearnet.yellow.com/ws');
```

### Step 5: Authentication Flow

Implement the authentication process:

```javascript
ws.onopen = async () => {
  console.log('WebSocket connected');
  
  // Create authentication request
  const authRequestMsgString = await createAuthRequestMessage({
    wallet: WALLET,
    participant: WALLET,
    app_name: 'my-yellow-dapp',
    expire: Math.floor(Date.now() / 1000) + 3600,
    scope: 'console',
    application: '0x0000000000000000000000000000000000000000',
    allowances: [],
  });
  
  // Parse and sign the message
  const authRequestMsg = JSON.parse(authRequestMsgString);
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const msgString = JSON.stringify(authRequestMsg.req);
  const digest = ethers.utils.id(msgString);
  const signature = await wallet.signMessage(ethers.utils.arrayify(digest));
  
  // Add signature and send
  authRequestMsg.sig = [signature];
  ws.send(JSON.stringify(authRequestMsg));
};
```

## 🔐 Understanding Authentication

The Yellow SDK uses **EIP-712** for secure authentication. Here's how it works:

### 1. Authentication Request
- Create a structured message with your wallet, app details, and permissions
- The SDK generates a JSON-RPC message ready for signing

### 2. Message Signing
- Use your wallet's private key to sign the authentication request
- This proves you own the wallet without exposing the private key

### 3. Challenge-Response
- The server sends a challenge message
- You respond with a signed EIP-712 message
- Upon successful verification, you receive a JWT token

## 🌐 WebSocket Communication

The Yellow SDK uses WebSocket for real-time communication:

### Connection Management
```javascript
const ws = new WebSocket('wss://clearnet.yellow.com/ws');

ws.onopen = () => {
  console.log('Connected to Yellow Network');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle different message types
};

ws.onerror = (error) => {
  console.error('Connection error:', error);
};
```

### Message Handling
The SDK supports various RPC methods:
- `AuthChallenge`: Server authentication challenge
- `AuthVerify`: Authentication verification response
- `Error`: Error handling

## 🏗️ Building Your Application

### Session Management
After authentication, create application sessions:

```javascript
let sessionId = null;
let isAuthenticated = false;

async function createSession() {
  if (!isAuthenticated) {
    throw new Error('Must be authenticated to create session');
  }
  
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`Session created: ${sessionId}`);
}
```

### State Management
Track your application state:

```javascript
const appState = {
  isAuthenticated: false,
  jwtToken: null,
  sessionId: null,
  wallet: null,
  network: 'Yellow Network (ClearNet)'
};
```

## 🧪 Testing Your Integration

### Run the Demo
```bash
node index.js
```

### Expected Flow
1. WebSocket connection established
2. Authentication request sent
3. Challenge received and responded to
4. Authentication successful
5. JWT token received
6. Session created
7. Demo operations completed

## 🔧 Common Issues and Solutions

### Connection Issues
- **Problem**: WebSocket connection fails
- **Solution**: Check network connectivity and firewall settings

### Authentication Failures
- **Problem**: Authentication always fails
- **Solution**: Verify wallet address and private key are correct

### Message Parsing Errors
- **Problem**: JSON parsing errors
- **Solution**: Ensure proper error handling and message validation

## 📚 Next Steps

Now that you have a basic understanding:

1. **Explore Advanced Features**: Dive deeper into transfer operations and session management
2. **Build Real Applications**: Create production-ready DApps using the SDK
3. **Join the Community**: Connect with other developers using Yellow Network
4. **Contribute**: Help improve the SDK and documentation

## 🆘 Getting Help

- **Documentation**: [Yellow Network Docs](https://docs.yellow.ai)
- **Community**: Join Yellow Network developer channels
- **Issues**: Report bugs and request features on GitHub
- **Support**: Contact the Yellow Network team for technical support

## 🎉 Congratulations!

You've successfully set up the Yellow SDK and built your first integration. You now have the foundation to create powerful decentralized applications on the Yellow Network. Happy building!
