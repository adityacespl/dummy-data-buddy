import { useState } from 'react';
import { X, CheckCircle, Zap, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DeployModal = ({ isOpen, onClose, generatedCode }) => {
  const [currentStep, setCurrentStep] = useState('review');
  const [isDeploying, setIsDeploying] = useState(false);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    setIsDeploying(true);
    setCurrentStep('deploy');
    
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false);
      setCurrentStep('success');
    }, 3000);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-muted/20 rounded-lg p-4 font-mono text-xs max-h-60 overflow-auto">
              <pre>{generatedCode.slice(0, 500)}...</pre>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setCurrentStep('tokenomics')} className="gradient-primary">
                Next: Tokenomics
              </Button>
            </div>
          </div>
        );
      
      case 'tokenomics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-3">
                  <PieChart size={16} className="text-primary" />
                  <h4 className="font-semibold">Token Distribution</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Public Sale</span><span>40%</span></div>
                  <div className="flex justify-between"><span>Team</span><span>20%</span></div>
                  <div className="flex justify-between"><span>Treasury</span><span>30%</span></div>
                  <div className="flex justify-between"><span>Liquidity</span><span>10%</span></div>
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">Gas Estimation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Deployment</span><span>0.05 SEI</span></div>
                  <div className="flex justify-between"><span>Verification</span><span>0.01 SEI</span></div>
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Total</span><span>0.06 SEI</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setCurrentStep('review')}>Back</Button>
              <Button onClick={handleDeploy} className="gradient-primary">
                Deploy Contract
              </Button>
            </div>
          </div>
        );
      
      case 'deploy':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Deploying to Sei Network</h3>
            <p className="text-muted-foreground">This may take a few moments...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle size={64} className="text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Deployment Successful!</h3>
            <div className="bg-card p-4 rounded-lg border mb-6">
              <p className="text-sm text-muted-foreground mb-2">Contract Address:</p>
              <p className="font-mono text-sm">0x742d35Cc6841C0532b1dC7...</p>
            </div>
            <Button onClick={onClose} className="gradient-primary">Close</Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl border border-border max-w-2xl w-full animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Zap className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Deploy to Sei</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};