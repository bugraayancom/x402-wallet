# Deployment Guide

This guide covers deploying x402 Wallet Studio to various platforms.

## Prerequisites

- Node.js 18+
- pnpm or npm
- Git
- Environment variables configured

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure required variables:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_key  # Optional
VITE_INFURA_API_KEY=your_infura_key    # Optional
```

## Platform-Specific Deployment

### Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Serverless functions support
- Free tier available

**Steps:**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Or connect via GitHub:
   - Push code to GitHub
   - Import repository in Vercel dashboard
   - Configure environment variables
   - Deploy

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "cd client && pnpm install && pnpm build",
  "outputDirectory": "client/dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

### Netlify

**Steps:**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Or via GitHub:
   - Connect repository
   - Configure build settings:
     - Base directory: `client`
     - Build command: `pnpm install && pnpm build`
     - Publish directory: `client/dist`

**Configuration** (`netlify.toml`):
```toml
[build]
  base = "client"
  command = "pnpm install && pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cloudflare Pages

**Steps:**

1. Push to GitHub
2. Connect repository in Cloudflare Pages
3. Configure:
   - Build command: `cd client && pnpm install && pnpm build`
   - Build output: `client/dist`
   - Root directory: `/`

### Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY client/package.json ./client/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source
COPY . .

# Build
RUN pnpm build

# Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**Build and run:**
```bash
docker build -t x402-wallet-studio .
docker run -p 3000:3000 x402-wallet-studio
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
```

### Self-Hosted (VPS)

**Requirements:**
- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx (recommended)
- PM2 for process management

**Steps:**

1. Install dependencies:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pnpm pm2
```

2. Clone and build:
```bash
git clone https://github.com/x402/wallet-studio.git
cd wallet-studio
pnpm install
pnpm build
```

3. Start with PM2:
```bash
pm2 start dist/index.js --name x402-wallet
pm2 save
pm2 startup
```

4. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. Enable HTTPS with Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### AWS

#### S3 + CloudFront

**Steps:**

1. Build static files:
```bash
cd client
pnpm build
```

2. Create S3 bucket:
```bash
aws s3 mb s3://x402-wallet-studio
```

3. Upload files:
```bash
aws s3 sync dist/ s3://x402-wallet-studio --delete
```

4. Configure CloudFront distribution
5. Set up Route 53 for domain

#### Elastic Beanstalk

**Steps:**

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
eb init
```

3. Deploy:
```bash
eb create production
eb deploy
```

## CI/CD Setup

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Optimization

### Pre-deployment Checklist

- [ ] Minify JavaScript and CSS
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Remove console.logs
- [ ] Set up CDN
- [ ] Enable HTTP/2
- [ ] Configure security headers

### Build Optimization

```bash
# Analyze bundle size
pnpm build
npx vite-bundle-visualizer

# Check lighthouse score
npm install -g lighthouse
lighthouse https://your-domain.com
```

## Monitoring

### Error Tracking

Add Sentry:
```bash
pnpm add @sentry/react @sentry/vite-plugin
```

Configure in `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
```

### Analytics

Add analytics in `index.html`:
```html
<script defer src="https://analytics.x402.org/umami.js"
        data-website-id="your-id"></script>
```

## Post-Deployment

1. **Test thoroughly:**
   - Wallet connections
   - Transactions
   - All chains
   - Mobile responsiveness

2. **Monitor:**
   - Error rates
   - Performance metrics
   - User feedback

3. **Set up alerts:**
   - Uptime monitoring
   - Error rate thresholds
   - Performance degradation

## Rollback Procedure

### Vercel
```bash
vercel rollback
```

### Docker
```bash
docker tag x402-wallet-studio:latest x402-wallet-studio:backup
docker pull x402-wallet-studio:previous
docker run x402-wallet-studio:previous
```

### PM2
```bash
pm2 stop x402-wallet
git checkout previous-commit
pnpm build
pm2 restart x402-wallet
```

## Troubleshooting

### Build Fails

- Check Node.js version
- Clear cache: `rm -rf node_modules && pnpm install`
- Check environment variables

### Runtime Errors

- Check browser console
- Verify API endpoints
- Check network connectivity
- Review Sentry logs

### Performance Issues

- Check bundle size
- Review network requests
- Enable caching
- Use CDN for assets

## Support

- Documentation: https://docs.x402.org
- Issues: https://github.com/x402/wallet-studio/issues
- Discord: https://discord.gg/x402
