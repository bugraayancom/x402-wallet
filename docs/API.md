# x402 Wallet Studio - API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.x402.org
```

## Authentication

Currently, the API does not require authentication. Future versions will implement JWT-based authentication.

## Rate Limiting

- **Development**: No rate limiting
- **Production**: 100 requests per minute per IP

## Endpoints

### Health Check

Check API status and version.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1699564800000,
  "version": "1.0.0"
}
```

---

### Token Prices

#### Get Single Token Price

**Endpoint:** `GET /api/prices/:symbol`

**Parameters:**
- `symbol` (path): Token symbol (ETH, BTC, MATIC, etc.)

**Example:**
```bash
curl https://api.x402.org/api/prices/ETH
```

**Response:**
```json
{
  "symbol": "ETH",
  "usdPrice": 2000.50,
  "timestamp": 1699564800000
}
```

**Error Response:**
```json
{
  "error": "Token not found",
  "symbol": "INVALID"
}
```

#### Get Multiple Token Prices

**Endpoint:** `POST /api/prices/batch`

**Body:**
```json
{
  "symbols": ["ETH", "BTC", "MATIC"]
}
```

**Response:**
```json
{
  "prices": [
    { "symbol": "ETH", "usdPrice": 2000.50 },
    { "symbol": "BTC", "usdPrice": 45000.00 },
    { "symbol": "MATIC", "usdPrice": 0.80 }
  ],
  "timestamp": 1699564800000
}
```

---

### Transactions

#### Get Transaction History

**Endpoint:** `GET /api/transactions/:address`

**Parameters:**
- `address` (path): Ethereum address
- `chainId` (query): Chain ID (1, 8453, 137, etc.)
- `limit` (query): Number of transactions (default: 20)

**Example:**
```bash
curl "https://api.x402.org/api/transactions/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb?chainId=1&limit=10"
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "chainId": 1,
  "transactions": [
    {
      "hash": "0x1a2b3c4d5e6f",
      "type": "receive",
      "amount": "0.5",
      "token": "ETH",
      "status": "completed",
      "timestamp": 1699564800000,
      "from": "0x123...",
      "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "chainId": 1
    }
  ],
  "total": 1
}
```

---

### Gas Prices

#### Get Current Gas Prices

**Endpoint:** `GET /api/gas-prices`

**Response:**
```json
{
  "prices": {
    "1": {
      "low": 25,
      "medium": 30,
      "high": 40,
      "unit": "gwei"
    },
    "8453": {
      "low": 0.001,
      "medium": 0.002,
      "high": 0.003,
      "unit": "gwei"
    }
  },
  "timestamp": 1699564800000
}
```

---

### x402 Protocol

#### Create Payment Request

**Endpoint:** `POST /api/x402/payments/create`

**Body:**
```json
{
  "amount": "0.5",
  "currency": "ETH",
  "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "description": "Premium content access",
  "method": "direct",
  "chainId": 1
}
```

**Response:**
```json
{
  "id": "req_1699564800_abc123",
  "amount": "0.5",
  "currency": "ETH",
  "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "description": "Premium content access",
  "method": "direct",
  "chainId": 1,
  "expiresAt": 1699568400000,
  "createdAt": 1699564800000,
  "status": "pending"
}
```

#### Submit Payment

**Endpoint:** `POST /api/x402/payments/submit`

**Body:**
```json
{
  "requestId": "req_1699564800_abc123",
  "transactionHash": "0xabc123def456",
  "chainId": 1
}
```

**Response:**
```json
{
  "requestId": "req_1699564800_abc123",
  "status": "completed",
  "transactionHash": "0xabc123def456",
  "chainId": 1,
  "confirmedAt": 1699564900000
}
```

#### Get Payment Status

**Endpoint:** `GET /api/x402/payments/:requestId/status`

**Response:**
```json
{
  "requestId": "req_1699564800_abc123",
  "status": "completed",
  "transactionHash": "0xabc123def456",
  "confirmedAt": 1699564900000
}
```

#### Verify Payment

**Endpoint:** `POST /api/x402/payments/verify`

**Body:**
```json
{
  "requestId": "req_1699564800_abc123",
  "transactionHash": "0xabc123def456"
}
```

**Response:**
```json
{
  "verified": true,
  "requestId": "req_1699564800_abc123",
  "transactionHash": "0xabc123def456",
  "timestamp": 1699564900000
}
```

#### Get Payment History

**Endpoint:** `GET /api/x402/payments/history`

**Parameters:**
- `address` (query): Wallet address
- `limit` (query): Number of payments (default: 20)

**Example:**
```bash
curl "https://api.x402.org/api/x402/payments/history?address=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb&limit=10"
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "payments": [
    {
      "requestId": "req_123",
      "status": "completed",
      "amount": "0.5",
      "currency": "ETH",
      "transactionHash": "0xabc...",
      "timestamp": 1699564800000
    }
  ],
  "total": 1
}
```

#### Get Network Stats

**Endpoint:** `GET /api/x402/network/stats`

**Response:**
```json
{
  "activeFacilitators": 7,
  "avgResponseTime": 95,
  "totalTransactions": 12458,
  "networkStatus": "online",
  "timestamp": 1699564800000
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `400` - Bad Request: Invalid parameters
- `404` - Not Found: Resource not found
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error

---

## Webhook Events

Future feature: Receive webhooks for payment events.

**Events:**
- `payment.created`
- `payment.completed`
- `payment.failed`
- `payment.expired`

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.x402.org/api',
});

// Get token price
const price = await api.get('/prices/ETH');
console.log(price.data.usdPrice);

// Create payment
const payment = await api.post('/x402/payments/create', {
  amount: '0.5',
  currency: 'ETH',
  recipient: '0x...',
});
console.log(payment.data.id);
```

### Python

```python
import requests

BASE_URL = 'https://api.x402.org/api'

# Get token price
response = requests.get(f'{BASE_URL}/prices/ETH')
price = response.json()['usdPrice']
print(f'ETH Price: ${price}')

# Create payment
payment = requests.post(f'{BASE_URL}/x402/payments/create', json={
    'amount': '0.5',
    'currency': 'ETH',
    'recipient': '0x...'
})
print(f'Payment ID: {payment.json()["id"]}')
```

---

## Support

- Documentation: https://docs.x402.org
- GitHub: https://github.com/x402
- Discord: https://discord.gg/x402
- Email: api@x402.org
