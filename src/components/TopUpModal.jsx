import { useState } from 'react';
import { X, Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const topUpOptions = [
  { amount: 10, label: 'Build a memecoin dapp', icon: '🚀' },
  { amount: 30, label: 'Build a DEX', icon: '🔄' },
  { amount: 50, label: 'Build a full lending protocol', icon: '🏦' },
  { amount: 100, label: 'Enterprise solution', icon: '🏢' }
];

export const TopUpModal = ({ isOpen, onClose, onTopUp, currentBalance }) => {
  const [selectedAmount, setSelectedAmount] = useState(10);

  if (!isOpen) return null;

  const handleSliderChange = (value) => {
    const amount = value[0];
    // Find the closest predefined amount
    const closest = topUpOptions.reduce((prev, curr) =>
      Math.abs(curr.amount - amount) < Math.abs(prev.amount - amount) ? curr : prev
    );
    setSelectedAmount(closest.amount);
  };

  const handleTopUp = () => {
    onTopUp(selectedAmount);
    onClose();
  };

  const selectedOption = topUpOptions.find(option => option.amount === selectedAmount);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Top Up SEI Balance</h3>
              <p className="text-sm text-muted-foreground">Current: {currentBalance} SEI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Select Amount</label>
              <div className="flex items-center space-x-2 text-primary font-semibold">
                <Plus size={16} />
                <span>{selectedAmount} SEI</span>
              </div>
            </div>

            <div className="px-2">
              <Slider
                value={[selectedAmount]}
                onValueChange={handleSliderChange}
                max={100}
                min={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>10</span>
                <span>30</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {selectedOption && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedOption.icon}</span>
                <div>
                  <div className="font-medium text-primary">{selectedAmount} SEI</div>
                  <div className="text-sm text-muted-foreground">{selectedOption.label}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {topUpOptions.map((option) => (
              <button
                key={option.amount}
                onClick={() => setSelectedAmount(option.amount)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  selectedAmount === option.amount
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{option.icon}</span>
                  <span className="font-medium">{option.amount} SEI</span>
                </div>
                <div className="text-xs text-muted-foreground">{option.label}</div>
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleTopUp} className="flex-1 gradient-primary font-semibold">
              Top Up {selectedAmount} SEI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};