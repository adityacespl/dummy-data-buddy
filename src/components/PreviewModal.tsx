import { useState } from 'react';
import { X, Code, Eye, Layers, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedCode: string;
  projectType: string;
}

export const PreviewModal = ({ isOpen, onClose, generatedCode, projectType }: PreviewModalProps) => {
  const [activeTab, setActiveTab] = useState<'frontend' | 'contract' | 'architecture'>('frontend');

  if (!isOpen) return null;

  const tabs = [
    { id: 'frontend' as const, name: 'Frontend', icon: Eye },
    { id: 'contract' as const, name: 'Smart Contract', icon: Code },
    { id: 'architecture' as const, name: 'Architecture', icon: Layers }
  ];

  const renderFrontendPreview = () => (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="bg-background rounded-lg border border-border min-h-96 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          {projectType.toLowerCase().includes('memecoin') && (
            <div className="space-y-6">
              <div className="bg-gradient-primary p-8 rounded-2xl text-white">
                <h2 className="text-3xl font-bold mb-2">🚀 MEMECOIN</h2>
                <p className="text-lg opacity-90">To The Moon!</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Total Supply</p>
                  <p className="text-xl font-bold">1B MEME</p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Max Wallet</p>
                  <p className="text-xl font-bold">5%</p>
                </div>
              </div>
              <Button className="w-full gradient-primary">Launch Token</Button>
            </div>
          )}
          
          {projectType.toLowerCase().includes('nft') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">🖼️ NFT Marketplace</h2>
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-gradient-primary rounded-lg flex items-center justify-center text-white text-2xl">
                    #{i}
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">Buy</Button>
                <Button variant="outline" className="flex-1">Sell</Button>
              </div>
            </div>
          )}

          {!projectType.toLowerCase().includes('memecoin') && !projectType.toLowerCase().includes('nft') && (
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-3xl">
                🔮
              </div>
              <h2 className="text-xl font-bold">Interactive Web3 App</h2>
              <p className="text-muted-foreground">
                Your generated application with smart contract integration
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-primary/10 p-2 rounded text-primary">Connected</div>
                <div className="bg-success/10 p-2 rounded text-success">Deployed</div>
                <div className="bg-warning/10 p-2 rounded text-warning">Testing</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContractCode = () => (
    <div className="bg-muted/20 rounded-lg border border-border p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">Smart Contract Code</span>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigator.clipboard.writeText(generatedCode)}
          >
            <Copy size={14} className="mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink size={14} className="mr-1" />
            Open in IDE
          </Button>
        </div>
      </div>
      <pre className="text-xs leading-relaxed text-foreground overflow-auto max-h-96">
        {generatedCode || '// Smart contract code will be displayed here'}
      </pre>
    </div>
  );

  const renderArchitecture = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Code size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Frontend</h3>
          <p className="text-xs text-muted-foreground">React + Web3</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Layers size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Smart Contract</h3>
          <p className="text-xs text-muted-foreground">Solidity</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Eye size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Sei Network</h3>
          <p className="text-xs text-muted-foreground">Layer 1</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Technical Stack</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Blockchain</span>
            <span className="text-sm text-primary font-medium">Sei Network</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Smart Contract</span>
            <span className="text-sm text-primary font-medium">Solidity ^0.8.19</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Frontend</span>
            <span className="text-sm text-primary font-medium">React + TypeScript</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Web3 Integration</span>
            <span className="text-sm text-primary font-medium">ethers.js</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Project Preview</h2>
            <p className="text-sm text-muted-foreground">{projectType}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'frontend' && renderFrontendPreview()}
          {activeTab === 'contract' && renderContractCode()}
          {activeTab === 'architecture' && renderArchitecture()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>✅ Security audited</span>
            <span>⚡ Gas optimized</span>
            <span>🔧 Production ready</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button className="gradient-primary">
              Deploy to Sei
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};