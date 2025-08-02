import { Settings, User, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LeftPanel = ({ selectedAgent, onAgentSelect, chatHistories }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    <div className="w-64 panel-bg border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/05438ebc-12c5-4750-bd93-a7ca3b298a09.png" 
            alt="framew0rk logo" 
            className="h-6 w-auto object-contain"
          />
        </div>
      </div>

      {/* AI Agents */}
      <div className="p-4 space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          AI AGENTS
        </h2>
        {agents.map((agent) => {
          return (
            <button
              key={agent.id}
              onClick={() => onAgentSelect(agent.id)}
              className={`w-full p-3 rounded-lg border transition-all duration-300 text-left group ${
                selectedAgent === agent.id
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-border glow-border'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg bg-card flex items-center justify-center`}>
                  <span className="text-lg">{agent.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {agent.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Token Launch */}
      <div className="px-4 pb-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          TOKEN LAUNCH
        </h2>
        <button
          onClick={() => navigate('/bonding-curve')}
          className="w-full p-3 rounded-lg border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-300 text-left group glow-border"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">🚀</span>
            </div>
            <div>
              <h3 className="font-medium text-sm text-primary">Bonding Curve</h3>
              <p className="text-xs text-muted-foreground leading-tight">
                Launch your token and raise funds
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-hidden">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          RECENT CHATS
        </h2>
        <div className="space-y-2 overflow-y-auto max-h-64">
          {chatHistories.map((chat) => (
            <button
              key={chat.id}
              className="w-full p-2 rounded-md border border-border hover:border-primary/50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-xs truncate">{chat.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(chat.timestamp)}
                </span>
              </div>
              {chat.preview && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {chat.preview}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Account Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div className="flex-1">
            <p className="font-medium text-xs">{user?.name || 'Developer'}</p>
            <p className="text-xs text-muted-foreground">{user?.tier || 'Free'} Tier</p>
          </div>
          <button 
            className="p-1 hover:bg-accent rounded-md transition-colors"
            onClick={() => navigate('/profile')}
          >
            <span className="text-sm">⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
};