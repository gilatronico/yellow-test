import WebSocket from 'ws';
import nitrolite from '@erc7824/nitrolite';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createEIP712AuthMessageSigner,
  //parseRPCResponse,
  RPCMethod,
} = nitrolite;
const parseRPCResponse = nitrolite.parseRPCResponse || JSON.parse;

// Configuration from environment variables
const WALLET = process.env.WALLET_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Validate required environment variables
if (!WALLET || !PRIVATE_KEY) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Please set WALLET_ADDRESS and PRIVATE_KEY in your .env file');
  console.error('See .env.example for reference');
  process.exit(1);
} 

const ws = new WebSocket('wss://clearnet.yellow.com/ws');

// Variable global para almacenar authRequestMsg
let authRequestMsg = null;

ws.onerror = (error) => {
  console.error('⚠️ Error en WebSocket:', error);
};

ws.onclose = (event) => {
  console.log(`🔒 Conexión cerrada: ${event.code} ${event.reason}`);
};

ws.onopen = async () => {
  console.log('WebSocket connection established');

  // Create and send auth_request
  const authRequestMsgString = await createAuthRequestMessage({
    wallet: WALLET,
    participant: WALLET,
    app_name: 'yellow-test_AGR',
    expire: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    scope: 'console',
    application: '0x0000000000000000000000000000000000000000',
    allowances: [],
  });

  // Parse the JSON string to get the object
  authRequestMsg = JSON.parse(authRequestMsgString);

  // 1. Instanciar tu wallet con la private key
  const wallet = new ethers.Wallet(PRIVATE_KEY);

  // 2. Serializar la parte `req` del mensaje
  const msgString = JSON.stringify(authRequestMsg.req);

  // 3. Crear hash
  const digest = ethers.utils.id(msgString);

  // 4. Firmar el hash con tu private key
  const signature = await wallet.signMessage(ethers.utils.arrayify(digest));

  // 5. Añadir la firma al objeto
  authRequestMsg.sig = [signature];

  // 6. Enviar al ClearNode
  console.log('📤 Enviando auth_request firmado:', authRequestMsg);
  ws.send(JSON.stringify(authRequestMsg));
};

// Global state
let isAuthenticated = false;
let jwtToken = null;
let sessionId = null;

// Handle incoming messages
ws.onmessage = async (event) => {
  try {
    const message = parseRPCResponse(event.data);
    
    // Handle auth_challenge response
    switch (message.method) {
      case RPCMethod.AuthChallenge:
        console.log('🔐 Received auth challenge');
        //wallet instance
        const wallet = new ethers.Wallet(PRIVATE_KEY);

        // Create EIP-712 message signer function
        const eip712MessageSigner = createEIP712AuthMessageSigner(
          wallet, // Your wallet client instance
          {  
            // EIP-712 message structure, data should match auth_request
            scope: authRequestMsg.scope,
            application: authRequestMsg.application,
            participant: authRequestMsg.participant,
            expire: authRequestMsg.expire,
            allowances: authRequestMsg.allowances,
          },
          { 
            // Domain for EIP-712 signing
            name: 'Yellow Demo App',
          },
        )
        
        // Create and send auth_verify with signed challenge
        const authVerifyMsg = await createAuthVerifyMessage(
          eip712MessageSigner, // Our custom eip712 signer function
          message,
        );
        
        ws.send(authVerifyMsg);
        break;
        
      // Handle auth_success or auth_failure
      case RPCMethod.AuthVerify:
        if (!message.params.success) {
          console.log('❌ Authentication failed');
          return;
        }
        console.log('✅ Authentication successful');
        isAuthenticated = true;
        jwtToken = message.params.jwtToken;
        console.log("🔑 JWT recibido:", jwtToken);
        
        // Start demo functionality after authentication
        await startDemo();
        break;
        
      case RPCMethod.Error: {
        console.error('❌ Authentication failed:', message.params.error);
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

// Demo functionality
async function startDemo() {
  console.log('\n🚀 Starting Yellow SDK Demo...');
  
  // Demo 1: Create a session
  await createSession();
  
  // Demo 2: Simulate a transfer (mock)
  await simulateTransfer();
  
  // Demo 3: Show session info
  await showSessionInfo();
}

async function createSession() {
  console.log('\n📱 Creating app session...');
  
  // In a real implementation, you would use the Yellow SDK to create a session
  // For demo purposes, we'll simulate this
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`✅ Session created: ${sessionId}`);
  console.log(`   - Wallet: ${WALLET}`);
  console.log(`   - App: yellow-test_AGR`);
  console.log(`   - Scope: console`);
}

async function simulateTransfer() {
  console.log('\n💸 Simulating transfer...');
  
  // Mock transfer data
  const transferData = {
    from: WALLET,
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Mock recipient
    amount: '0.001',
    token: 'ETH',
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Transfer details:');
  console.log(`   - From: ${transferData.from}`);
  console.log(`   - To: ${transferData.to}`);
  console.log(`   - Amount: ${transferData.amount} ${transferData.token}`);
  console.log(`   - Time: ${transferData.timestamp}`);
  
  // In a real implementation, you would use the Yellow SDK to execute the transfer
  console.log('✅ Transfer simulated successfully');
}

async function showSessionInfo() {
  console.log('\n📊 Session Information:');
  console.log(`   - Session ID: ${sessionId}`);
  console.log(`   - Authenticated: ${isAuthenticated}`);
  console.log(`   - JWT Token: ${jwtToken ? 'Present' : 'Not available'}`);
  console.log(`   - Wallet Address: ${WALLET}`);
  console.log(`   - Network: Yellow Network (ClearNet)`);
  
  console.log('\n🎉 Demo completed successfully!');
  console.log('   This demonstrates the core capabilities of the Yellow SDK:');
  console.log('   ✅ WebSocket connection to Yellow Network');
  console.log('   ✅ EIP-712 authentication');
  console.log('   ✅ JWT token management');
  console.log('   ✅ Session creation');
  console.log('   ✅ Transfer simulation');
}
