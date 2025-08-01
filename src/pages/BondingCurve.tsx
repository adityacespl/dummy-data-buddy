import { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Zap, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Dummy bonding curve data
const bondingCurveData = [
  { supply: 0, price: 0.001, marketCap: 0 },
  { supply: 100000, price: 0.0015, marketCap: 150 },
  { supply: 200000, price: 0.0025, marketCap: 500 },
  { supply: 300000, price: 0.004, marketCap: 1200 },
  { supply: 400000, price: 0.0065, marketCap: 2600 },
  { supply: 500000, price: 0.01, marketCap: 5000 },
  { supply: 600000, price: 0.016, marketCap: 9600 },
  { supply: 700000, price: 0.025, marketCap: 17500 },
  { supply: 800000, price: 0.04, marketCap: 32000 },
  { supply: 900000, price: 0.065, marketCap: 58500 },
  { supply: 1000000, price: 0.1, marketCap: 100000 }
];

const tradingData = [
  { time: '09:00', volume: 1200, price: 0.0045 },
  { time: '10:00', volume: 1800, price: 0.0052 },
  { time: '11:00', volume: 2400, price: 0.0048 },
  { time: '12:00', volume: 3200, price: 0.0065 },
  { time: '13:00', volume: 2800, price: 0.0071 },
  { time: '14:00', volume: 4100, price: 0.0089 },
  { time: '15:00', volume: 5500, price: 0.0095 },
  { time: '16:00', volume: 3900, price: 0.0087 }
];

export const BondingCurve = () => {
  const navigate = useNavigate();
  const [investAmount, setInvestAmount] = useState('');
  const [selectedToken] = useState({
    name: 'FRAMEW0RK',
    symbol: 'FRW',
    description: 'The native utility token powering the framew0rk ecosystem',
    currentPrice: 0.0067,
    currentSupply: 456789,
    maxSupply: 1000000,
    marketCap: 3058,
    holders: 1247,
    volume24h: 28500
  });

  const calculateReturns = (amount: number) => {
    const currentPrice = selectedToken.currentPrice;
    const tokensReceived = amount / currentPrice;
    const newSupply = selectedToken.currentSupply + tokensReceived;
    const newPrice = bondingCurveData.find(point => point.supply >= newSupply)?.price || currentPrice * 1.2;
    const potentialValue = tokensReceived * newPrice;
    const returns = ((potentialValue - amount) / amount) * 100;
    return { tokensReceived, newPrice, potentialValue, returns };
  };

  const investment = investAmount ? parseFloat(investAmount) : 0;
  const calculation = investment > 0 ? calculateReturns(investment) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border panel-bg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="glow-border"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Token Bonding Curve</h1>
                <p className="text-muted-foreground">Launch your token and raise funds with automated market making</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <TrendingUp size={14} className="mr-1" />
                Live Trading
              </Badge>
              <Badge variant="outline">
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Token Info & Stats */}
          <div className="space-y-6">
            {/* Token Card */}
            <Card className="p-6 glow-border">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedToken.symbol}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedToken.name}</h3>
                  <p className="text-muted-foreground">${selectedToken.symbol}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selectedToken.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="text-lg font-semibold text-primary">${selectedToken.currentPrice.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-semibold">${selectedToken.marketCap.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Holders</p>
                  <p className="text-lg font-semibold">{selectedToken.holders.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-semibold">${selectedToken.volume24h.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Supply Progress */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Token Supply Progress</h4>
                <span className="text-sm text-muted-foreground">
                  {((selectedToken.currentSupply / selectedToken.maxSupply) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(selectedToken.currentSupply / selectedToken.maxSupply) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{selectedToken.currentSupply.toLocaleString()}</span>
                <span>{selectedToken.maxSupply.toLocaleString()}</span>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Recent Activity</h4>
              <div className="space-y-3">
                {[
                  { action: 'Buy', amount: '1,250 FRW', value: '$8.38', time: '2m ago', user: '0x1a2b...3c4d' },
                  { action: 'Sell', amount: '890 FRW', value: '$5.96', time: '5m ago', user: '0x5e6f...7g8h' },
                  { action: 'Buy', amount: '2,100 FRW', value: '$14.07', time: '8m ago', user: '0x9i0j...1k2l' },
                  { action: 'Buy', amount: '750 FRW', value: '$5.02', time: '12m ago', user: '0x3m4n...5o6p' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center space-x-3">
                      <Badge variant={activity.action === 'Buy' ? 'default' : 'secondary'} className="text-xs">
                        {activity.action}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{activity.amount}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{activity.value}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center Column - Bonding Curve Chart */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Bonding Curve</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Info size={16} />
                  <span>Price increases with supply</span>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bondingCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="supply" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toFixed(3)}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: any, name: string) => [
                        name === 'price' ? `$${value.toFixed(4)}` : `$${value.toLocaleString()}`,
                        name === 'price' ? 'Price' : 'Market Cap'
                      ]}
                      labelFormatter={(supply) => `Supply: ${(supply / 1000).toFixed(0)}k tokens`}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorPrice)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Trading Volume Chart */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">24h Trading Volume</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tradingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column - Investment Calculator */}
          <div className="space-y-6">
            <Card className="p-6 glow-border">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="text-primary" size={24} />
                <h3 className="text-lg font-semibold">Investment Calculator</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Investment Amount (SEI)</label>
                  <Input
                    type="number"
                    placeholder="Enter SEI amount"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {calculation && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Tokens Received</p>
                        <p className="text-lg font-semibold text-primary">
                          {calculation.tokensReceived.toLocaleString(undefined, { maximumFractionDigits: 0 })} FRW
                        </p>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">New Price</p>
                        <p className="text-lg font-semibold">${calculation.newPrice.toFixed(4)}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Potential Returns</span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp size={16} className="text-primary" />
                          <span className={`font-bold text-lg ${calculation.returns > 0 ? 'text-primary' : 'text-red-400'}`}>
                            {calculation.returns > 0 ? '+' : ''}{calculation.returns.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Potential value: ${calculation.potentialValue.toFixed(2)} SEI
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full gradient-primary font-semibold" 
                  size="lg"
                  disabled={!investAmount || parseFloat(investAmount) <= 0}
                >
                  <DollarSign size={18} className="mr-2" />
                  Buy {selectedToken.symbol}
                </Button>
              </div>
            </Card>

            {/* Key Metrics */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Key Metrics</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-primary" />
                    <span className="text-sm">Total Holders</span>
                  </div>
                  <span className="font-semibold">{selectedToken.holders.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap size={16} className="text-primary" />
                    <span className="text-sm">Liquidity Pool</span>
                  </div>
                  <span className="font-semibold">$45,230</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="text-sm">Price Impact</span>
                  </div>
                  <span className="font-semibold text-primary">0.12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-primary" />
                    <span className="text-sm">Trading Fee</span>
                  </div>
                  <span className="font-semibold">0.3%</span>
                </div>
              </div>
            </Card>

            {/* Risk Warning */}
            <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-start space-x-3">
                <Info size={16} className="text-yellow-500 mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-yellow-500 mb-1">Risk Warning</h5>
                  <p className="text-xs text-muted-foreground">
                    Token bonding curves involve significant risk. Prices can be volatile and there's no guarantee of returns. 
                    Only invest what you can afford to lose.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};