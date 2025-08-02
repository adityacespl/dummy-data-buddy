import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';
import { PreviewPanel } from './PreviewPanel';
import { DeployModal } from './DeployModal';

export const Framew0rkApp = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState('dev');
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [seiBalance, setSeiBalance] = useState(847);
  const [chatHistories] = useState([
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

  const templates = [
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

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    // Simulate AI response with typing effect
    setTimeout(() => {
      const aiMessage = {
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

  const handleTemplateSelect = (template) => {
    const message = `Build a ${template.name} - ${template.description}`;
    handleSendMessage(message);
  };

  const handleTopUp = (amount) => {
    setSeiBalance(prev => prev + amount);
  };

  const generateAIResponse = (userInput, agent) => {
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

  const generateMockCode = (userInput) => {
    if (userInput.toLowerCase().includes('prediction') || userInput.toLowerCase().includes('gta')) {
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket is ReentrancyGuard, Ownable {
    struct Market {
        uint256 id;
        string question;
        uint256 endTime;
        uint256 totalYesAmount;
        uint256 totalNoAmount;
        bool resolved;
        bool outcome;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
    }
    
    mapping(uint256 => Market) public markets;
    uint256 public marketCount;
    uint256 public constant FEE_PERCENTAGE = 3; // 3% platform fee
    
    event MarketCreated(uint256 indexed marketId, string question, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed user, bool prediction, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event WinningsWithdrawn(uint256 indexed marketId, address indexed user, uint256 amount);
    
    function createMarket(string memory _question, uint256 _endTime) external onlyOwner {
        require(_endTime > block.timestamp, "End time must be in future");
        
        marketCount++;
        Market storage newMarket = markets[marketCount];
        newMarket.id = marketCount;
        newMarket.question = _question;
        newMarket.endTime = _endTime;
        
        emit MarketCreated(marketCount, _question, _endTime);
    }
    
    function placeBet(uint256 _marketId, bool _prediction) external payable nonReentrant {
        Market storage market = markets[_marketId];
        require(market.endTime > block.timestamp, "Market has ended");
        require(!market.resolved, "Market already resolved");
        require(msg.value > 0, "Bet amount must be greater than 0");
        
        if (_prediction) {
            market.yesBets[msg.sender] += msg.value;
            market.totalYesAmount += msg.value;
        } else {
            market.noBets[msg.sender] += msg.value;
            market.totalNoAmount += msg.value;
        }
        
        emit BetPlaced(_marketId, msg.sender, _prediction, msg.value);
    }
    
    function resolveMarket(uint256 _marketId, bool _outcome) external onlyOwner {
        Market storage market = markets[_marketId];
        require(market.endTime <= block.timestamp, "Market has not ended");
        require(!market.resolved, "Market already resolved");
        
        market.resolved = true;
        market.outcome = _outcome;
        
        emit MarketResolved(_marketId, _outcome);
    }
    
    function withdrawWinnings(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");
        
        uint256 winnings = calculateWinnings(_marketId, msg.sender);
        require(winnings > 0, "No winnings to withdraw");
        
        if (market.outcome) {
            market.yesBets[msg.sender] = 0;
        } else {
            market.noBets[msg.sender] = 0;
        }
        
        payable(msg.sender).transfer(winnings);
        emit WinningsWithdrawn(_marketId, msg.sender, winnings);
    }
    
    function calculateWinnings(uint256 _marketId, address _user) public view returns (uint256) {
        Market storage market = markets[_marketId];
        if (!market.resolved) return 0;
        
        uint256 totalPool = market.totalYesAmount + market.totalNoAmount;
        uint256 userBet;
        uint256 winningPool;
        
        if (market.outcome) {
            userBet = market.yesBets[_user];
            winningPool = market.totalYesAmount;
        } else {
            userBet = market.noBets[_user];
            winningPool = market.totalNoAmount;
        }
        
        if (userBet == 0 || winningPool == 0) return 0;
        
        uint256 grossWinnings = (userBet * totalPool) / winningPool;
        uint256 fee = (grossWinnings * FEE_PERCENTAGE) / 100;
        
        return grossWinnings - fee;
    }
}`;
    }
    
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
    <div className="h-screen bg-background flex overflow-hidden">
      <LeftPanel
        selectedAgent={selectedAgent}
        onAgentSelect={setSelectedAgent}
        chatHistories={chatHistories}
      />
      
      <div className={`flex flex-1 transition-all duration-500 ease-in-out ${showPreview ? '' : ''}`}>
        <div className={`transition-all duration-500 ease-in-out ${showPreview ? 'w-1/2' : 'flex-1'}`}>
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
        </div>
        
        {showPreview && (
          <PreviewPanel
            isVisible={showPreview}
            projectType={messages[messages.length - 2]?.content || 'Web3 App'}
            generatedCode={generatedCode}
            onDeploy={() => setShowDeploy(true)}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
      
      {!showPreview && (
        <RightPanel
          templates={templates}
          onTemplateSelect={handleTemplateSelect}
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
  );
};