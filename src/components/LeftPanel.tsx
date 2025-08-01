import { Code, FileText, Coins, Settings, User } from 'lucide-react';
import { AgentType, ChatHistory } from './Framew0rkApp';

interface LeftPanelProps {
  selectedAgent: AgentType;
  onAgentSelect: (agent: AgentType) => void;
  chatHistories: ChatHistory[];
}

export const LeftPanel = ({ selectedAgent, onAgentSelect, chatHistories }: LeftPanelProps) => {
  const agents = [
    {
      id: 'dev' as AgentType,
      name: 'Dev Agent',
      description: 'AI-Guided App Development',
      icon: Code,
      color: 'text-primary'
    },
    {
      id: 'whitepaper' as AgentType,
      name: 'Whitepaper Agent',
      description: 'Professional Documentation',
      icon: FileText,
      color: 'text-blue-400'
    },
    {
      id: 'tokenomics' as AgentType,
      name: 'Tokenomics Agent',
      description: 'Token Economics Design',
      icon: Coins,
      color: 'text-yellow-400'
    }
  ];

  const formatTimeAgo = (date: Date) => {
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full relative">
              <div className="absolute inset-1 bg-primary rounded-full"></div>
              <div className="absolute top-1 left-1 w-2 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-glow">framew0rk</h1>
            <p className="text-xs text-muted-foreground">AI Web3 Platform</p>
          </div>
        </div>
      </div>

      {/* AI Agents */}
      <div className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          AI Agents
        </h2>
        {agents.map((agent) => {
          const Icon = agent.icon;
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
                <div className={`p-2 rounded-lg bg-card ${
                  selectedAgent === agent.id ? 'text-primary' : agent.color
                }`}>
                  <Icon size={20} />
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
            <User size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Developer</p>
            <p className="text-xs text-muted-foreground">Free Tier</p>
          </div>
          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
            <Settings size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};