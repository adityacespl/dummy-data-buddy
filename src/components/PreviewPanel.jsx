import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';

export const PreviewPanel = ({ isVisible, projectType, generatedCode, onDeploy, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview');

  const tabs = [
    { id: 'preview', name: 'App Preview', emoji: '📱' },
    { id: 'code', name: 'Code View', emoji: '💻' },
    { id: 'deploy', name: 'Deploy', emoji: '🚀' }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderPreview = () => {
    if (projectType.includes('prediction market') || projectType.includes('GTA')) {
      return (
        <div className="h-full bg-gradient-to-br from-background to-muted/50 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                🎮 GTA 6 Launch Prediction Market
              </h1>
              <p className="text-muted-foreground">Bet on when Rockstar will finally release GTA 6</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary">$2.4M</div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">1,234</div>
                <div className="text-sm text-muted-foreground">Active Bets</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">Q2 2025</div>
                <div className="text-sm text-muted-foreground">Most Popular</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Market Odds</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Q1 2025</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 w-[15%]"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Q2 2025</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 w-[45%]"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Q3 2025</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[25%]"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span>2026 or Later</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[15%]"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Betting Interface */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">💰 Place Your Bet</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Outcome</label>
                  <select className="w-full p-3 bg-background border border-border rounded-lg">
                    <option>Q2 2025 (45% odds)</option>
                    <option>Q3 2025 (25% odds)</option>
                    <option>Q1 2025 (15% odds)</option>
                    <option>2026 or Later (15% odds)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Bet Amount</label>
                  <input
                    type="number"
                    placeholder="0.0"
                    className="w-full p-3 bg-background border border-border rounded-lg"
                  />
                </div>
              </div>
              <Button className="w-full mt-4 gradient-primary font-semibold">
                🎯 Place Bet
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-gradient-to-br from-background to-muted/50 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🚀</div>
          <h3 className="text-xl font-semibold">Web3 App Preview</h3>
          <p className="text-muted-foreground">Your generated application would appear here</p>
        </div>
      </div>
    );
  };

  const renderCodeView = () => (
    <div className="h-full bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Generated Code</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(generatedCode)}
          >
            <Copy size={16} />
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink size={16} />
          </Button>
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 h-[calc(100%-80px)] overflow-y-auto">
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
          {generatedCode || "// Generated code will appear here\n// Smart contracts, frontend components, and more..."}
        </pre>
      </div>
    </div>
  );

  const renderDeployView = () => (
    <div className="h-full bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">🚀 Deploy to Sei Network</h3>
          <p className="text-muted-foreground">Review your project before deployment</p>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-semibold mb-2">📋 Project Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project Type:</span>
                <span>{projectType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span>Sei Network</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Estimate:</span>
                <span>~0.05 SEI</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-semibold mb-2">💰 Tokenomics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply:</span>
                <span>1,000,000 tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Initial Price:</span>
                <span>$0.01 per token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bonding Curve:</span>
                <span>Linear (customizable)</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onDeploy}
            className="w-full gradient-primary font-semibold py-3"
          >
            Deploy to Sei Network
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="w-1/2 border-l border-border bg-background animate-slide-in-right">
      {/* Header */}
      <div className="h-16 border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl">👀</span>
          <h2 className="font-semibold">Project Preview</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.emoji} {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 h-[calc(100vh-128px)]">
        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'code' && renderCodeView()}
        {activeTab === 'deploy' && renderDeployView()}
      </div>
    </div>
  );
};