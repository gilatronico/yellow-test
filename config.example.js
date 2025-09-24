// Yellow SDK Configuration Example
// Copy this file to config.js and fill in your values

export const config = {
  // Your Ethereum wallet address
  wallet: '0xYourWalletAddress',
  
  // Your private key (NEVER commit this to version control)
  privateKey: '0xYourPrivateKey',
  
  // Your application name
  appName: 'my-yellow-dapp',
  
  // Yellow Network endpoint
  wsEndpoint: 'wss://clearnet.yellow.com/ws',
  
  // Session expiration time (in seconds)
  sessionExpiry: 3600,
  
  // Application scope
  scope: 'console',
  
  // Application address (use zero address for testing)
  application: '0x0000000000000000000000000000000000000000',
  
  // Allowances (empty array for basic usage)
  allowances: []
};

// Usage in your main file:
// import { config } from './config.js';
// const WALLET = config.wallet;
// const PRIVATE_KEY = config.privateKey;
