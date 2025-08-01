import { useState, useRef, useEffect } from 'react';
import { Send, Zap, Code, User, Bot, Copy, ExternalLink, Wallet, FileText, Coins } from 'lucide-react';
import { AgentType, ChatMessage } from './Framew0rkApp';
import { Button } from '@/components/ui/button';
import { TopUpModal } from './TopUpModal';

interface CenterPanelProps {
  selectedAgent: AgentType;
  messages: ChatMessage[];
  isGenerating: boolean;
  seiBalance: number;
  onSendMessage: (message: string) => void;
  onShowDeploy: () => void;
  hasGeneratedCode: boolean;
  onTopUp: (amount: number) => void;
}

export const CenterPanel = ({
  selectedAgent,
  messages,
  isGenerating,
  seiBalance,
  onSendMessage,
  onShowDeploy,
  hasGeneratedCode,
  onTopUp
}: CenterPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAgentIcon = () => {
    switch (selectedAgent) {
      case 'dev':
        return { Icon: Code, color: 'text-primary' };
      case 'whitepaper':
        return { Icon: FileText, color: 'text-blue-400' };
      case 'tokenomics':
        return { Icon: Coins, color: 'text-yellow-400' };
      default:
        return { Icon: Code, color: 'text-primary' };
    }
  };

  const getAgentGradient = () => {
    switch (selectedAgent) {
      case 'dev':
        return 'from-primary/60 via-primary/30 to-primary/60';
      case 'whitepaper':
        return 'from-blue-500/60 via-blue-400/30 to-blue-500/60';
      case 'tokenomics':
        return 'from-yellow-500/60 via-yellow-400/30 to-yellow-500/60';
      default:
        return 'from-primary/60 via-primary/30 to-primary/60';
    }
  };

  const { Icon: AgentIcon, color: agentColor } = getAgentIcon();
  const gradientClass = getAgentGradient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isGenerating) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const getAgentInfo = (agent: AgentType) => {
    const agentMap = {
      dev: { name: 'Dev Agent', color: 'text-primary', emoji: '🤖' },
      whitepaper: { name: 'Whitepaper Agent', color: 'text-blue-400', emoji: '📄' },
      tokenomics: { name: 'Tokenomics Agent', color: 'text-yellow-400', emoji: '💰' }
    };
    return agentMap[agent];
  };

  const agentInfo = getAgentInfo(selectedAgent);
  const progressPercentage = Math.min((seiBalance / 1000) * 100, 100);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border panel-bg px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{agentInfo.emoji}</span>
          <div>
            <h2 className={`font-semibold ${agentInfo.color}`}>{agentInfo.name}</h2>
            <p className="text-xs text-muted-foreground">Ready to help you build</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap size={16} className="text-primary" />
            <div className="text-right">
              <p className="text-sm font-semibold">{seiBalance} SEI</p>
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="glow-border"
              onClick={() => setShowTopUpModal(true)}
            >
              Top Up
            </Button>
            <div className="w-px h-6 bg-border"></div>
            <Button 
              variant="outline" 
              size="sm" 
              className="glow-border flex items-center space-x-2"
              onClick={() => {/* TODO: Connect wallet logic */}}
            >
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{agentInfo.emoji}</div>
            <h3 className="text-xl font-semibold mb-2">Ready to build something amazing?</h3>
            <p className="text-muted-foreground mb-6">
              Describe your Web3 project or choose a template to get started
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <button 
                className="p-3 rounded-lg border border-border glow-border text-left"
                onClick={() => onSendMessage('Build a DeFi staking platform')}
              >
                <div className="text-sm font-medium">🏦 DeFi Platform</div>
                <div className="text-xs text-muted-foreground">Staking & rewards</div>
              </button>
              <button 
                className="p-3 rounded-lg border border-border glow-border text-left"
                onClick={() => onSendMessage('Create an NFT marketplace')}
              >
                <div className="text-sm font-medium">🖼️ NFT Marketplace</div>
                <div className="text-xs text-muted-foreground">Buy, sell, trade</div>
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="animate-fade-in">
            <div className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'justify-end' : ''
            }`}>
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div className={`max-w-3xl ${
                message.type === 'user' 
                  ? 'bg-primary text-white rounded-2xl rounded-br-sm' 
                  : 'bg-card border border-border rounded-2xl rounded-bl-sm'
              } p-4`}>
                {message.isCode && message.isGenerating ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Code size={16} className="text-primary" />
                      <span className="text-sm font-medium">Generating code...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded animate-pulse" />
                      <div className="h-2 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-2 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.isCode && !message.isGenerating && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>✅ Code generated successfully</span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => copyToClipboard(message.content)}
                              className="hover:text-primary transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                            <button className="hover:text-primary transition-colors">
                              <ExternalLink size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}

        {hasGeneratedCode && (
          <div className="animate-slide-up">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Code size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Code Generated Successfully!</h4>
                    <p className="text-sm text-muted-foreground">Ready to preview and deploy</p>
                  </div>
                </div>
                <Button 
                  onClick={onShowDeploy}
                  className="gradient-primary font-semibold"
                >
                  Deploy to Sei
                </Button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-6">
        <div className="relative">
          {/* Animated neon border */}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradientClass} opacity-75 animate-pulse blur-[1px]`}></div>
          <div className={`absolute inset-[1px] rounded-xl bg-gradient-to-r ${gradientClass} opacity-50 animate-pulse`} style={{animationDelay: '0.3s'}}></div>
          
          <form onSubmit={handleSubmit} className="relative bg-card rounded-xl border border-transparent overflow-hidden">
            <div className="flex items-center space-x-4 p-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-background border border-current shadow-lg`}>
                <AgentIcon size={20} className={`${agentColor} animate-pulse`} />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask ${agentInfo.name} to help build your Web3 project...`}
                  className="w-full p-3 bg-transparent border-none outline-none placeholder-muted-foreground text-foreground"
                  disabled={isGenerating}
                />
              </div>
              <Button
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                className="px-6 gradient-primary font-semibold"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onTopUp={onTopUp}
        currentBalance={seiBalance}
      />
    </div>
  );
};