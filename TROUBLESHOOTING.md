# Yellow SDK Troubleshooting Guide

This guide addresses common issues encountered during Yellow SDK integration, based on real-world testing and development experience.

## 🚨 Common Errors & Solutions

### 1. Authentication Issues

#### Error: `TypeError: Cannot read properties of undefined (reading 'length')`
```
TypeError: Cannot read properties of undefined (reading 'length')
    at toUtf8Bytes (/node_modules/@ethersproject/strings/lib/utf8.js:179:29)
    at Object.id (/node_modules/@ethersproject/hash/lib/id.js:7:65)
```

**Cause**: `createAuthRequestMessage()` returns a JSON string, not an object
**Solution**:
```javascript
// ❌ Wrong
const authRequestMsg = await createAuthRequestMessage({...});
const msgString = JSON.stringify(authRequestMsg.req); // authRequestMsg.req is undefined

// ✅ Correct
const authRequestMsgString = await createAuthRequestMessage({...});
const authRequestMsg = JSON.parse(authRequestMsgString);
const msgString = JSON.stringify(authRequestMsg.req); // Works!
```

#### Error: `Missing required environment variables`
```
❌ Error: Missing required environment variables
Please set WALLET_ADDRESS and PRIVATE_KEY in your .env file
```

**Cause**: Environment variables not properly configured
**Solution**:
1. Copy `env.example` to `.env`
2. Fill in your wallet address and private key
3. Ensure `.env` is in your project root
4. Restart your application

### 2. WebSocket Connection Issues

#### Error: `Connection closed: 1006`
```
🔒 Conexión cerrada: 1006
```

**Cause**: WebSocket connection closed unexpectedly
**Possible Reasons**:
- Network connectivity issues
- Server-side connection limits
- Authentication timeout
- Invalid credentials

**Solutions**:
1. Check your internet connection
2. Verify your wallet address and private key
3. Try reconnecting after a few seconds
4. Check Yellow Network status

#### Error: `WebSocket connection failed`
```
⚠️ Error en WebSocket: [object Error]
```

**Cause**: Unable to establish WebSocket connection
**Solutions**:
1. Check if `wss://clearnet.yellow.com/ws` is accessible
2. Verify firewall settings
3. Try different network
4. Check Yellow Network maintenance status

### 3. Configuration Issues

#### Error: `Cannot read properties of undefined (reading 'req')`
```
TypeError: Cannot read properties of undefined (reading 'req')
```

**Cause**: `authRequestMsg` is undefined
**Solution**:
```javascript
// Add validation
if (!authRequestMsg || !authRequestMsg.req) {
  console.error('Authentication message not properly initialized');
  return;
}
```

#### Error: `Invalid private key format`
```
Error: invalid private key
```

**Cause**: Private key format is incorrect
**Solution**:
- Ensure private key starts with `0x`
- Check for typos
- Verify key length (64 characters + 0x prefix)

### 4. Environment Setup Issues

#### Error: `dotenv: Error: ENOENT: no such file or directory, open '.env'`
```
[dotenv] Error: ENOENT: no such file or directory, open '.env'
```

**Cause**: `.env` file doesn't exist
**Solution**:
```bash
cp env.example .env
# Then edit .env with your values
```

#### Error: `Module not found: 'dotenv'`
```
Error: Cannot find module 'dotenv'
```

**Cause**: dotenv package not installed
**Solution**:
```bash
npm install dotenv
```

## 🔧 Debugging Tips

### 1. Enable Debug Logging
```javascript
// Add this to see detailed logs
console.log('🔍 Debug - authRequestMsg:', JSON.stringify(authRequestMsg, null, 2));
console.log('🔍 Debug - authRequestMsg.req:', authRequestMsg.req);
```

### 2. Validate Configuration
```javascript
// Add this validation function
function validateConfig() {
  const required = ['WALLET_ADDRESS', 'PRIVATE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    process.exit(1);
  }
  
  console.log('✅ Configuration validated');
}
```

### 3. Test WebSocket Connection
```javascript
// Add connection testing
ws.onopen = () => {
  console.log('✅ WebSocket connected successfully');
  // Your existing code...
};

ws.onerror = (error) => {
  console.error('❌ WebSocket error:', error);
  console.error('Check your network connection and Yellow Network status');
};

ws.onclose = (event) => {
  console.log(`🔒 Connection closed: ${event.code} ${event.reason}`);
  if (event.code !== 1000) {
    console.log('⚠️  Unexpected disconnection. Check network and credentials.');
  }
};
```

## 🛡️ Security Best Practices

### 1. Never Commit Private Keys
```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
```

### 2. Use Environment Variables
```javascript
// ❌ Never do this
const PRIVATE_KEY = '0x1234...';

// ✅ Always do this
const PRIVATE_KEY = process.env.PRIVATE_KEY;
```

### 3. Validate Input
```javascript
// Add input validation
function validateWalletAddress(address) {
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    throw new Error('Invalid wallet address format');
  }
}
```

## 📞 Getting Help

### 1. Check Documentation
- [Yellow Network Docs](https://docs.yellow.ai)
- [ERC-7824 Standard](https://eips.ethereum.org/EIPS/eip-7824)
- [Ethers.js Documentation](https://docs.ethers.io)

### 2. Community Support
- Yellow Network Discord
- GitHub Issues
- Stack Overflow (tag: yellow-network)

### 3. Debug Checklist
- [ ] Environment variables set correctly
- [ ] WebSocket endpoint accessible
- [ ] Wallet address and private key valid
- [ ] Network connection stable
- [ ] Yellow Network operational

## 🚀 Performance Tips

### 1. Connection Management
```javascript
// Implement reconnection logic
function reconnect() {
  setTimeout(() => {
    console.log('🔄 Attempting to reconnect...');
    // Recreate WebSocket connection
  }, 5000);
}
```

### 2. Error Handling
```javascript
// Wrap async operations in try-catch
try {
  const result = await someAsyncOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error appropriately
}
```

### 3. Resource Cleanup
```javascript
// Clean up resources on exit
process.on('SIGINT', () => {
  console.log('🔄 Closing WebSocket connection...');
  ws.close();
  process.exit(0);
});
```

This troubleshooting guide is based on real development experience and should help resolve most common issues with the Yellow SDK.
