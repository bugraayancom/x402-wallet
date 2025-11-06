import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  Send, 
  Download, 
  History, 
  Settings, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
  Network
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  token: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  hash: string;
  chain: string;
}

interface ChainBalance {
  chain: string;
  balance: string;
  usdValue: string;
  icon: string;
  color: string;
}

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [walletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");

  const chainBalances: ChainBalance[] = [
    { chain: "Base", balance: "5.234", usdValue: "$8,234", icon: "🔵", color: "from-blue-500 to-blue-600" },
    { chain: "Polygon", balance: "2.891", usdValue: "$4,224", icon: "🟣", color: "from-purple-500 to-purple-600" },
    { chain: "Ethereum", balance: "0.012", usdValue: "$2,450", icon: "⬥", color: "from-gray-400 to-gray-500" },
    { chain: "Arbitrum", balance: "1.456", usdValue: "$1,892", icon: "🔷", color: "from-cyan-500 to-cyan-600" },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: "1",
      type: "receive",
      amount: "+0.5",
      token: "ETH",
      status: "completed",
      timestamp: "2 minutes ago",
      hash: "0x1a2b3c...",
      chain: "Base"
    },
    {
      id: "2",
      type: "send",
      amount: "-0.25",
      token: "USDC",
      status: "completed",
      timestamp: "1 hour ago",
      hash: "0x4d5e6f...",
      chain: "Polygon"
    },
    {
      id: "3",
      type: "receive",
      amount: "+1.2",
      token: "MATIC",
      status: "pending",
      timestamp: "3 hours ago",
      hash: "0x7g8h9i...",
      chain: "Polygon"
    },
    {
      id: "4",
      type: "send",
      amount: "-0.1",
      token: "ETH",
      status: "failed",
      timestamp: "5 hours ago",
      hash: "0xjklmno...",
      chain: "Ethereum"
    },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied to clipboard!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                x402 Wallet Studio
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Overview */}
            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-chart-2/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                    <h2 className="text-4xl font-bold">$12,458.32</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">+12.5% ($1,234.56)</span>
                      <span className="text-sm text-muted-foreground">this month</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Receive
                    </Button>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <code className="text-sm flex-1 font-mono">{walletAddress}</code>
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chain Balances */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Assets by Chain</CardTitle>
                <CardDescription>Your balances across different networks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {chainBalances.map((chain) => (
                    <div
                      key={chain.chain}
                      className="p-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${chain.color} flex items-center justify-center text-xl`}>
                            {chain.icon}
                          </div>
                          <div>
                            <div className="font-semibold">{chain.chain}</div>
                            <div className="text-xs text-muted-foreground">Active</div>
                          </div>
                        </div>
                        <Network className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{chain.usdValue}</div>
                        <div className="text-sm text-muted-foreground">{chain.balance} tokens</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest x402 payment activity</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'receive' 
                            ? 'bg-green-500/20' 
                            : 'bg-blue-500/20'
                        }`}>
                          {tx.type === 'receive' ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-500" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {tx.type === 'receive' ? 'Received' : 'Sent'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {tx.chain}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{tx.timestamp}</span>
                            <span>•</span>
                            <code className="text-xs">{tx.hash}</code>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`font-semibold ${
                            tx.type === 'receive' ? 'text-green-500' : 'text-foreground'
                          }`}>
                            {tx.amount} {tx.token}
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            {getStatusIcon(tx.status)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {tx.status}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Gas Fees
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Network className="w-4 h-4 mr-2" />
                  Switch Network
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <History className="w-4 h-4 mr-2" />
                  Export History
                </Button>
              </CardContent>
            </Card>

            {/* Gas Tracker */}
            <Card className="border-border/50 bg-gradient-to-br from-chart-2/5 to-chart-3/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-chart-2" />
                  Gas Tracker
                </CardTitle>
                <CardDescription>Current network fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Base</span>
                    <span className="font-semibold text-green-500">Low</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Fee</span>
                    <span className="font-mono font-semibold">$0.001</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ethereum</span>
                    <span className="font-semibold text-yellow-500">Medium</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Fee</span>
                    <span className="font-mono font-semibold">$2.45</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Polygon</span>
                    <span className="font-semibold text-green-500">Low</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Fee</span>
                    <span className="font-mono font-semibold">$0.003</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* x402 Status */}
            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-chart-2/5">
              <CardHeader>
                <CardTitle className="text-sm">x402 Protocol Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-semibold">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Facilitators</span>
                  <span className="text-sm font-semibold">7 Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Response</span>
                  <span className="text-sm font-semibold">&lt; 100ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
