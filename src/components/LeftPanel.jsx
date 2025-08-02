import { Settings, User, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeftPanel = ({ selectedAgent, onAgentSelect, chatHistories }) => {
  const navigate = useNavigate();
  
  const agents = [
    {
      id: 'dev',
      name: 'Dev Agent',
      description: 'AI-Guided App Development',
      emoji: '🤖',
      color: 'text-primary'
    },
    {
      id: 'whitepaper',
      name: 'Whitepaper Agent',
      description: 'Professional Documentation',
      emoji: '📄',
      color: 'text-blue-400'
    },
    {
      id: 'tokenomics',
      name: 'Tokenomics Agent',
      description: 'Token Economics Design',
      emoji: '💰',
      color: 'text-yellow-400'
    }
  ];

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="w-80 panel-bg border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/05438ebc-12c5-4750-bd93-a7ca3b298a09.png" 
            alt="framew0rk logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* AI Agents */}
      <div className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          AI Agents
        </h2>
        {agents.map((agent) => {
          return (
            <button
              key={agent.id}
              onClick={() => onAgentSelect(agent.id)}
              className={`w-full p-4 rounded-xl border transition-all duration-300 text-left group ${
                selectedAgent === agent.id
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-border glow-border'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-card flex items-center justify-center`}>
                  <span className="text-2xl">{agent.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Token Launch */}
      <div className="px-6 pb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Token Launch
        </h2>
        <button
          onClick={() => navigate('/bonding-curve')}
          className="w-full p-4 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-300 text-left group glow-border"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-primary">Bonding Curve</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Launch your token and raise funds
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-6 overflow-hidden">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Recent Chats
        </h2>
        <div className="space-y-3 overflow-y-auto max-h-96">
          {chatHistories.map((chat) => (
            <button
              key={chat.id}
              className="w-full p-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm truncate">{chat.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(chat.timestamp)}
                </span>
              </div>
              {chat.preview && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {chat.preview}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Account Section */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Developer</p>
            <p className="text-xs text-muted-foreground">Free Tier</p>
          </div>
          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
};