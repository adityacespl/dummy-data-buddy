import { useState } from 'react';
import { X, Code, Eye, Layers, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PreviewModal = ({ isOpen, onClose, generatedCode, projectType }) => {
  const [activeTab, setActiveTab] = useState('frontend');

  if (isOpen) return null;

  const tabs = [
    { id, name, icon,
    { id, name, icon,
    { id, name, icon= () => (

          {projectType.toLowerCase().includes('memecoin') && (

                🚀 MEMECOIN
                To The Moon

                  Total Supply
                  1B MEME

                  Max Wallet
                  5%

              Launch Token
            
          )}
          
          {projectType.toLowerCase().includes('nft') && (
            
              🖼️ NFT Marketplace
              
                {[1,2,3,4].map(i => (
                  
                    #{i}
                  
                ))}

                Buy
                Sell

          )}

          {projectType.toLowerCase().includes('memecoin') && projectType.toLowerCase().includes('nft') && (

                🔮
              
              Interactive Web3 App
              
                Your generated application with smart contract integration

                Connected
                Deployed
                Testing

          )}

  );

  const renderContractCode = () => (

        Smart Contract Code
        
           navigator.clipboard.writeText(generatedCode)}
          >
            
            Copy

            Open in IDE

        {generatedCode || '// Smart contract code will be displayed here'}

  );

  const renderArchitecture = () => (

          Frontend
          React + Web3

          Smart Contract
          Solidity

          Sei Network
          Layer 1

        Technical Stack

            Blockchain
            Sei Network

            Smart Contract
            Solidity ^0.8.19

            Frontend
            React + TypeScript

            Web3 Integration
            ethers.js

  );

  return (

        {/* Header */}

            Project Preview
            {projectType}

        {/* Tabs */}
        
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
               setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    ={16} />
                {tab.name}
              
            );
          })}

        {/* Content */}
        
          {activeTab === 'frontend' && renderFrontendPreview()}
          {activeTab === 'contract' && renderContractCode()}
          {activeTab === 'architecture' && renderArchitecture()}

        {/* Footer */}

            ✅ Security audited
            ⚡ Gas optimized
            🔧 Production ready

              Close Preview

              Deploy to Sei

  );
};