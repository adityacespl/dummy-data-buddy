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
      title: 'Token Economics Model',
      agent: 'tokenomics',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      preview: 'Designed deflationary token with burn mechanism'
    },
    {
      id: '4',
      title: 'Cross-chain Bridge',
      agent: 'dev',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      preview: 'Built secure bridge between Ethereum and Sei'
    },
    {
      id: '5',
      title: 'Governance Protocol',
      agent: 'whitepaper',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      preview: 'Outlined DAO structure with quadratic voting'
    },
    {
      id: '6',
      title: 'Liquidity Mining',
      agent: 'tokenomics',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      preview: 'Calculated optimal reward distribution'
    },
    {
      id: '7',
      title: 'AMM Protocol',
      agent: 'dev',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      preview: 'Implemented constant product formula with fees'
    },
    {
      id: '8',
      title: 'Privacy Coin Design',
      agent: 'whitepaper',
      timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      preview: 'Researched zero-knowledge proof implementation'
    },
    {
      id: '9',
      title: 'Flash Loan Protocol',
      agent: 'dev',
      timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      preview: 'Built uncollateralized lending with atomic transactions'
    }
  ]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAgentResponse(selectedAgent, message),
        timestamp: new Date(),
        isCode: selectedAgent === 'dev' && Math.random() > 0.3
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);

      // If it's code, set it for preview
      if (aiMessage.isCode) {
        setGeneratedCode(aiMessage.content);
      }
    }, 1500 + Math.random() * 2000);
  };

  const getAgentResponse = (agent, message) => {
    const responses = {
      dev: [
        `// Smart Contract for DeFi Yield Farming
pragma solidity ^0.8.0;

contract YieldFarm {
    mapping(address => uint256) public stakes;
    uint256 public totalStaked;
    uint256 public rewardRate = 15; // 15% APY

    function stake(uint256 amount) external {
        stakes[msg.sender] += amount;
        totalStaked += amount;
        // Transfer tokens from user
    }

    function calculateReward(address user) public view returns (uint256) {
        return stakes[user] * rewardRate / 100;
    }
}`,
        `// NFT Marketplace Contract
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace {
    struct Listing {
        uint256 price;
        address seller;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public royaltyPercentage = 5;

    function listNFT(uint256 tokenId, uint256 price) external {
        listings[tokenId] = Listing(price, msg.sender, true);
    }

    function buyNFT(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        // Calculate royalty
        uint256 royalty = (listing.price * royaltyPercentage) / 100;
        // Transfer NFT and handle payments
    }
}`
      ],
      tokenomics: [
        `Token Economics Analysis:

Total Supply: 1,000,000,000 tokens
Initial Distribution:
- Team: 15% (vested over 4 years)
- Investors: 20% (vested over 2 years)
- Community: 40% (liquidity mining rewards)
- Treasury: 25% (governance controlled)

Burn Mechanism:
- 2% of all transaction fees burned
- Quarterly burns based on protocol revenue
- Target: 50% supply reduction over 10 years

Staking Rewards:
- Base APY: 12%
- Bonus for longer lock periods
- Maximum lock: 4 years = 25% APY`,
        `Liquidity Mining Program:

Phase 1 (Months 1-6):
- 100,000 tokens per month
- 60% to LP providers
- 40% to single-asset stakers

Phase 2 (Months 7-12):
- 75,000 tokens per month
- Introduce governance staking

Phase 3 (Year 2+):
- Community-governed emissions
- Focus on protocol-owned liquidity

Expected TVL Growth:
- Month 1: $1M
- Month 6: $10M
- Year 1: $50M
- Year 2: $200M`
      ],
      whitepaper: [
        `# Decentralized Governance Protocol

## Abstract
This paper presents a novel approach to decentralized governance using quadratic voting mechanisms combined with reputation-based weighting.

## Introduction
Traditional governance systems suffer from plutocracy where large token holders dominate decisions. Our system addresses this through:

1. **Quadratic Voting**: Cost of votes increases quadratically
2. **Reputation Weighting**: Long-term contributors get bonus voting power
3. **Delegation Mechanisms**: Experts can represent smaller holders

## Technical Implementation

### Voting Power Calculation
\`\`\`
votingPower = sqrt(tokens) * reputationMultiplier
cost = votes^2
\`\`\`

### Reputation System
- Base reputation: 1.0x
- 6 months participation: 1.2x
- 1 year participation: 1.5x
- Core contributor: 2.0x

## Economic Incentives
Voters are rewarded for participation through:
- Governance token distributions
- Fee sharing from protocol revenue
- NFT badges for consistent participation`,
        `# Privacy-Preserving Cryptocurrency Design

## Overview
A new cryptocurrency architecture that provides complete transaction privacy while maintaining regulatory compliance capabilities.

## Technical Architecture

### Zero-Knowledge Proofs
- Uses zk-SNARKs for transaction validation
- Proves transaction validity without revealing amounts
- Maintains sender/receiver anonymity

### Selective Disclosure
- Users can generate compliance proofs
- Regulatory authorities can verify without full access
- Maintains privacy for law-abiding users

### Consensus Mechanism
- Proof-of-Stake with privacy-preserving validator selection
- Anonymous validator rewards
- Slashing conditions that preserve privacy

## Implementation Roadmap
1. Testnet launch with basic privacy features
2. Audit by leading security firms
3. Mainnet launch with full feature set
4. Integration with major exchanges`
      ]
    };

    const agentResponses = responses[agent] || responses.dev;
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const handleTopUp = (amount) => {
    setSeiBalance(prev => prev + amount);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <LeftPanel 
        selectedAgent={selectedAgent}
        onAgentSelect={setSelectedAgent}
        chatHistories={chatHistories}
        onNewChat={() => setMessages([])}
      />

      <div className="flex-1 flex">
        <CenterPanel
          selectedAgent={selectedAgent}
          messages={messages}
          isGenerating={isGenerating}
          seiBalance={seiBalance}
          onSendMessage={handleSendMessage}
          onShowDeploy={() => setShowDeploy(true)}
          hasGeneratedCode={generatedCode.length > 0}
          onTopUp={handleTopUp}
        />

        <RightPanel 
          onShowPreview={() => setShowPreview(true)}
          hasGeneratedCode={generatedCode.length > 0}
        />
      </div>

      {showPreview && (
        <PreviewPanel 
          code={generatedCode}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showDeploy && (
        <DeployModal
          isOpen={showDeploy}
          onClose={() => setShowDeploy(false)}
          onDeploy={() => {
            setShowDeploy(false);
            navigate('/bonding-curve');
          }}
          seiBalance={seiBalance}
          onTopUp={handleTopUp}
        />
      )}
    </div>
  );
};