# x402 Wallet Studio

A user-friendly wallet application designed specifically for the x402 protocol ecosystem. This app addresses the biggest UX gaps in the x402 ecosystem by providing a modern, intuitive interface for managing crypto payments and multi-chain assets.

## 🌟 Features

- **Modern Landing Page**: Beautiful dark-themed interface with purple-blue gradients
- **Wallet Dashboard**: Comprehensive overview of your assets across multiple chains
- **Multi-Chain Support**: Manage assets on Base, Polygon, Ethereum, Arbitrum, and more
- **Transaction History**: Real-time tracking with status indicators
- **Gas Fee Optimizer**: Live gas price tracking and optimization suggestions
- **x402 Protocol Integration**: Native support for x402 payment protocol
- **Theme Switcher**: Dark/light mode support
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Extract the ZIP file**
   ```bash
   unzip x402-wallet-studio.zip
   cd x402-wallet-studio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`

## 📦 Build for Production

```bash
cd client
pnpm build
# or
npm run build
```

The production-ready files will be in `client/dist/` directory.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `cd client && pnpm install && pnpm build`
   - Output Directory: `client/dist`
4. Deploy!

### Option 2: Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - Base directory: `client`
   - Build command: `pnpm install && pnpm build`
   - Publish directory: `client/dist`
4. Deploy!

### Option 3: GitHub Pages

1. Update `client/vite.config.ts`:
   ```typescript
   base: '/your-repo-name/'
   ```
2. Install gh-pages: `pnpm add -D gh-pages`
3. Add deploy script to `package.json`:
   ```json
   "deploy": "cd client && pnpm build && gh-pages -d dist"
   ```
4. Run: `pnpm run deploy`

### Option 4: Cloudflare Pages

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure build:
   - Build command: `cd client && pnpm install && pnpm build`
   - Build output: `client/dist`
4. Deploy!

## 📁 Project Structure

```
x402-wallet-studio/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx   # Landing page
│   │   │   └── Dashboard.tsx  # Wallet dashboard
│   │   ├── components/    # Reusable components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   ├── public/            # Static assets
│   └── index.html         # Entry HTML
├── server/                # Placeholder (static app)
├── shared/                # Shared constants
└── README.md             # This file
```

## 🎨 Tech Stack

- **Framework**: React 19
- **Routing**: Wouter
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Font**: Inter (Google Fonts)

## 🔧 Configuration

### Environment Variables

Currently, the app doesn't require any environment variables for basic functionality. If you need to add API integrations:

1. Create `.env` file in the root
2. Add your variables:
   ```
   VITE_API_URL=your_api_url
   VITE_API_KEY=your_api_key
   ```
3. Access in code: `import.meta.env.VITE_API_URL`

### Customization

- **Colors**: Edit `client/src/index.css` (CSS variables)
- **Theme**: Modify `client/src/App.tsx` (ThemeProvider)
- **Content**: Update page components in `client/src/pages/`

## 📝 Development

### Available Scripts

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm typecheck
```

### Adding New Pages

1. Create new component in `client/src/pages/`
2. Add route in `client/src/App.tsx`:
   ```tsx
   <Route path="/new-page" component={NewPage} />
   ```

### Adding New Components

Use shadcn/ui CLI:
```bash
pnpm dlx shadcn@latest add [component-name]
```

## 🐛 Troubleshooting

### Port Already in Use

Change port in `client/vite.config.ts`:
```typescript
server: {
  port: 3001
}
```

### Build Errors

1. Clear cache: `rm -rf node_modules client/node_modules`
2. Reinstall: `pnpm install`
3. Rebuild: `pnpm build`

### TypeScript Errors

Run type check: `pnpm typecheck`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [Your contact info]

## ✅ Completed Features

- [x] Wallet connection (MetaMask, Coinbase Wallet, WalletConnect)
- [x] Multi-chain support (Base, Ethereum, Polygon, Arbitrum, Optimism)
- [x] Transaction signing and management
- [x] Real-time balance tracking
- [x] Gas fee optimization
- [x] x402 protocol integration
- [x] Settings management
- [x] Security features (phishing detection, address validation)
- [x] Comprehensive testing setup
- [x] API backend with endpoints
- [x] Full documentation

## 🎯 Future Roadmap

- [ ] Hardware wallet support (Ledger, Trezor)
- [ ] ENS name resolution
- [ ] Token swap integration
- [ ] NFT gallery and management
- [ ] Transaction history export
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] DApp browser

---

**Built with ❤️ for the x402 ecosystem**

Visit: [x402.org](https://www.x402.org)
