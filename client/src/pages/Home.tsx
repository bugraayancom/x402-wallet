import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Zap, Shield, TrendingUp, ArrowRight, Sparkles, Network, DollarSign } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

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
              <Button variant="ghost" onClick={toggleTheme}>
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
              <Button variant="outline">Documentation</Button>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Built for the x402 Ecosystem</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              The Missing Piece of{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                x402 Payments
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A user-friendly wallet designed specifically for x402 protocol. Simplify crypto payments, 
              manage multi-chain assets, and optimize gas fees—all in one beautiful interface.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold">40+</div>
                <div className="text-sm text-muted-foreground">Supported Chains</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$0.001</div>
                <div className="text-sm text-muted-foreground">Avg. Gas Fee</div>
              </div>
              <div>
                <div className="text-2xl font-bold">&lt; 1s</div>
                <div className="text-sm text-muted-foreground">Transaction Time</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-3xl blur-3xl"></div>
            <Card className="relative border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Wallet Dashboard</CardTitle>
                <CardDescription>Manage all your x402 payments in one place</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-chart-2/10 border border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
                  <div className="text-3xl font-bold">$12,458.32</div>
                  <div className="text-sm text-green-500 mt-1">+12.5% this month</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-accent/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Network className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">Base</span>
                    </div>
                    <div className="text-xl font-bold">$8,234</div>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                        <Network className="w-4 h-4 text-chart-2" />
                      </div>
                      <span className="font-medium">Polygon</span>
                    </div>
                    <div className="text-xl font-bold">$4,224</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why x402 Wallet Studio?</h2>
          <p className="text-xl text-muted-foreground">
            Solving the biggest pain points in the x402 ecosystem
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Simple Wallet Setup</CardTitle>
              <CardDescription>
                No more confusing seed phrases. Set up your wallet in seconds with our guided flow.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-2/20 to-chart-3/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-chart-2" />
              </div>
              <CardTitle>Gas Fee Optimizer</CardTitle>
              <CardDescription>
                Real-time gas price tracking and optimization suggestions to save you money.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-3/20 to-chart-4/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-chart-3" />
              </div>
              <CardTitle>Transaction Preview</CardTitle>
              <CardDescription>
                See exactly what will happen before you sign. No more irreversible mistakes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-5/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-chart-4" />
              </div>
              <CardTitle>Multi-Chain Support</CardTitle>
              <CardDescription>
                Manage assets across 40+ chains from a single, unified interface.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-chart-2/5 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-lg text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent mb-2">
                  10k+
                </div>
                <div className="text-lg text-muted-foreground">Transactions</div>
              </div>
              <div>
                <div className="text-5xl font-bold bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent mb-2">
                  $2M+
                </div>
                <div className="text-lg text-muted-foreground">Volume Processed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-chart-2/10 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Experience the Future?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already enjoying seamless x402 payments 
              with Wallet Studio.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90">
                  Launch App Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Read Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">x402 Wallet Studio</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ for the x402 ecosystem
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">Twitter</Button>
              <Button variant="ghost" size="sm">Discord</Button>
              <Button variant="ghost" size="sm">GitHub</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
