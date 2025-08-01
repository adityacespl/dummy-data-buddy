import { useState } from 'react';
import { Code, FileText, Coins, MessageCircle, Users, Clock, Settings, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';
import { PreviewModal } from './PreviewModal';
import { DeployModal } from './DeployModal';

export type AgentType = 'dev' | 'whitepaper' | 'tokenomics';
export type Template = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
};

export type ChatMessage = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  isGenerating?: boolean;
};

export type ChatHistory = {
  id: string;
  title: string;
  agent: AgentType;
  timestamp: Date;
  preview?: string;
};

export const Framew0rkApp = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('dev');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [seiBalance, setSeiBalance] = useState(847);
  const [chatHistories] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'DeFi Yield Farm',
      agent: 'dev',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      preview: 'Implemented staking mechanism with 15% APY'
    },
    {
      id: '2',
      title: 'NFT Marketplace',
      agent: 'dev',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      preview: 'Created marketplace with royalty system'
    },
    {
      id: '3',
      title: 'Prediction Market',
      agent: 'dev',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      preview: 'Built binary prediction market for crypto prices'
    }
  ]);

  const templates: Template[] = [
    {
      id: 'memecoin',
      name: 'Memecoin Launcher',
      emoji: '🚀',
      description: 'Launch viral memecoins with utility',
      category: 'DeFi'
    },
    {
      id: 'prediction',
      name: 'Prediction Market',
      emoji: '🔮',
      description: 'Decentralized prediction platform',
      category: 'Gaming'
    },
    {
      id: 'arcade',
      name: 'Arcade Game',
      emoji: '🎮',
      description: 'Play-to-earn arcade experience',
      category: 'Gaming'
    },
    {
      id: 'nft-marketplace',
      name: 'NFT Marketplace',
      emoji: '🖼️',
      description: 'Buy, sell, trade NFTs',
      category: 'NFT'
    },
    {
      id: 'staking',
      name: 'Staking Pool',
      emoji: '💎',
      description: 'Stake tokens, earn rewards',
      category: 'DeFi'
    },
    {
      id: 'social-token',
      name: 'Social Token',
      emoji: '👥',
      description: 'Community-driven tokens',
      category: 'Social'
    }
  ];

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    // Simulate AI response with typing effect
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(content, selectedAgent),
        timestamp: new Date(),
        isCode: content.toLowerCase().includes('code') || content.toLowerCase().includes('build'),
        isGenerating: true
      };

      setMessages(prev => [...prev, aiMessage]);

      // Simulate code generation
      if (aiMessage.isCode) {
        setTimeout(() => {
          setGeneratedCode(generateMockCode(content));
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, isGenerating: false }
                : msg
            )
          );
          setIsGenerating(false);
          setShowPreview(true);
        }, 3000);
      } else {
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, isGenerating: false }
                : msg
            )
          );
          setIsGenerating(false);
        }, 2000);
      }
    }, 1000);
  };

  const handleTemplateSelect = (template: Template) => {
    const message = `Build a ${template.name} - ${template.description}`;
    handleSendMessage(message);
  };

  const handleTopUp = (amount: number) => {
    setSeiBalance(prev => prev + amount);
  };

  const generateAIResponse = (userInput: string, agent: AgentType): string => {
    const responses = {
      dev: [
        "I'll help you build that! Let me generate the smart contract and frontend code for your project.",
        "Perfect! I'm creating a comprehensive Web3 application with all the necessary components.",
        "Great idea! I'll implement the smart contracts with security best practices and create a beautiful frontend."
      ],
      whitepaper: [
        "I'll create a professional whitepaper that explains your project's technical architecture and tokenomics.",
        "Let me draft a comprehensive technical document that covers all aspects of your blockchain project.",
        "I'll prepare detailed documentation including technical specifications and business model."
      ],
      tokenomics: [
        "I'll design a sustainable token economy with proper distribution and utility mechanisms.",
        "Let me create a balanced tokenomics model with vesting schedules and governance features.",
        "I'll develop comprehensive token economics including staking rewards and deflationary mechanisms."
      ]
    };
    
    return responses[agent][Math.floor(Math.random() * responses[agent].length)];
  };

  const generateMockCode = (userInput: string): string => {
    if (userInput.toLowerCase().includes('memecoin') || userInput.toLowerCase().includes('token')) {
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemecoinLauncher is ERC20, Ownable {
    uint256 private constant TOTAL_SUPPLY = 1000000000 * 10**18; // 1B tokens
    uint256 public constant MAX_WALLET = TOTAL_SUPPLY * 5 / 100; // 5% max wallet
    
    mapping(address => bool) public isExcludedFromLimits;
    bool public tradingEnabled = false;
    
    event TradingEnabled();
    event WalletExcluded(address wallet);
    
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _mint(msg.sender, TOTAL_SUPPLY);
        isExcludedFromLimits[msg.sender] = true;
        isExcludedFromLimits[address(this)] = true;
    }
    
    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    function excludeFromLimits(address wallet) external onlyOwner {
        isExcludedFromLimits[wallet] = true;
        emit WalletExcluded(wallet);
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
        
        if (!tradingEnabled && from != owner() && to != owner()) {
            require(false, "Trading not enabled yet");
        }
        
        if (!isExcludedFromLimits[to] && from != address(0)) {
            require(
                balanceOf(to) + amount <= MAX_WALLET,
                "Exceeds max wallet"
            );
        }
    }
}`;
    }
    
    return `// Sample smart contract code will be generated here
// Based on your project requirements and selected template`;
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-border panel-bg px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold">framew0rk</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/bonding-curve')}
          className="flex items-center space-x-2 bg-gradient-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Rocket size={18} />
          <span>Launch your token and raise funds</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
      <LeftPanel
        selectedAgent={selectedAgent}
        onAgentSelect={setSelectedAgent}
        chatHistories={chatHistories}
      />
      
      <CenterPanel
        selectedAgent={selectedAgent}
        messages={messages}
        isGenerating={isGenerating}
        seiBalance={seiBalance}
        onSendMessage={handleSendMessage}
        onShowDeploy={() => setShowDeploy(true)}
        hasGeneratedCode={!!generatedCode}
        onTopUp={handleTopUp}
      />
      
      <RightPanel
        templates={templates}
        onTemplateSelect={handleTemplateSelect}
      />

      {showPreview && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          generatedCode={generatedCode}
          projectType={messages[messages.length - 2]?.content || 'Web3 App'}
        />
      )}

      {showDeploy && (
        <DeployModal
          isOpen={showDeploy}
          onClose={() => setShowDeploy(false)}
          generatedCode={generatedCode}
        />
      )}
      </div>
    </div>
  );
};