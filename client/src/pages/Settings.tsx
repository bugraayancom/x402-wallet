import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/contexts/ThemeContext";
import { Settings as SettingsIcon, Wallet, Shield, Bell, Globe, Zap, Save } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const settings = useSettingsStore();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">← Back</Button>
              </Link>
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                <span className="text-xl font-bold">Settings</span>
              </div>
            </div>
            <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-chart-2">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general"><Globe className="w-4 h-4 mr-2" />General</TabsTrigger>
            <TabsTrigger value="wallet"><Wallet className="w-4 h-4 mr-2" />Wallet</TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" />Security</TabsTrigger>
            <TabsTrigger value="transaction"><Zap className="w-4 h-4 mr-2" />Transaction</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize how the app looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={settings.setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="TRY">TRY (₺)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={settings.setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Show more information in less space</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => settings.updateSettings({ compactMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
                  </div>
                  <Switch checked={settings.analyticsEnabled} onCheckedChange={settings.toggleAnalytics} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Crash Reports</Label>
                    <p className="text-sm text-muted-foreground">Automatically send crash reports</p>
                  </div>
                  <Switch
                    checked={settings.crashReportsEnabled}
                    onCheckedChange={(checked) => settings.updateSettings({ crashReportsEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Settings */}
          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Display</CardTitle>
                <CardDescription>Control how your wallet information is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Balance</Label>
                    <p className="text-sm text-muted-foreground">Display wallet balance on dashboard</p>
                  </div>
                  <Switch checked={settings.showBalance} onCheckedChange={settings.toggleShowBalance} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Security</CardTitle>
                <CardDescription>Protect your assets with security features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Confirmation</Label>
                    <p className="text-sm text-muted-foreground">Confirm each transaction before signing</p>
                  </div>
                  <Switch
                    checked={settings.requireConfirmation}
                    onCheckedChange={(checked) => settings.updateSettings({ requireConfirmation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Phishing Warnings</Label>
                    <p className="text-sm text-muted-foreground">Warn about suspicious websites</p>
                  </div>
                  <Switch
                    checked={settings.phishingWarnings}
                    onCheckedChange={(checked) => settings.updateSettings({ phishingWarnings: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Secure Mode</Label>
                    <p className="text-sm text-muted-foreground">Enhanced security checks for all transactions</p>
                  </div>
                  <Switch
                    checked={settings.secureMode}
                    onCheckedChange={(checked) => settings.updateSettings({ secureMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction Settings */}
          <TabsContent value="transaction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gas Preferences</CardTitle>
                <CardDescription>Configure how you want to handle gas fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Gas Setting</Label>
                  <Select value={settings.gasPreference} onValueChange={settings.setGasPreference}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Slower)</SelectItem>
                      <SelectItem value="medium">Medium (Recommended)</SelectItem>
                      <SelectItem value="high">High (Faster)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.gasPreference === 'custom' && (
                  <div className="space-y-2">
                    <Label>Custom Gas Price (Gwei)</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={settings.customGasPrice}
                      onChange={(e) => settings.updateSettings({ customGasPrice: e.target.value })}
                    />
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Slippage Tolerance: {settings.slippageTolerance}%</Label>
                  </div>
                  <Slider
                    value={[settings.slippageTolerance]}
                    onValueChange={([value]) => settings.setSlippageTolerance(value)}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">Maximum price difference you'll accept</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve common transactions</p>
                  </div>
                  <Switch
                    checked={settings.autoApprove}
                    onCheckedChange={(checked) => settings.updateSettings({ autoApprove: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive all app notifications</p>
                  </div>
                  <Switch
                    checked={settings.notificationsEnabled}
                    onCheckedChange={settings.toggleNotifications}
                  />
                </div>

                {settings.notificationsEnabled && (
                  <>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Transaction Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified about transaction status</p>
                      </div>
                      <Switch
                        checked={settings.transactionNotifications}
                        onCheckedChange={(checked) => settings.updateSettings({ transactionNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">Alerts for significant price changes</p>
                      </div>
                      <Switch
                        checked={settings.priceAlerts}
                        onCheckedChange={(checked) => settings.updateSettings({ priceAlerts: checked })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
