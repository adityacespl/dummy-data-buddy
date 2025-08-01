import { Search, Filter } from 'lucide-react';
import { Template } from './Framew0rkApp';
import { useState } from 'react';

interface RightPanelProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

export const RightPanel = ({ templates, onTemplateSelect }: RightPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-80 panel-bg border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Pre-Audited Templates</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={14} className="text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-input border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              className="p-4 rounded-xl border border-border glow-border text-left group hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{template.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {template.description}
                  </p>
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-muted-foreground text-sm">No templates found</p>
            <p className="text-muted-foreground text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Coming Soon
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-dashed border-border">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌉</span>
                <div>
                  <p className="text-sm font-medium">Cross-Chain Bridge</p>
                  <p className="text-xs text-muted-foreground">Multi-chain asset transfers</p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-dashed border-border">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏛️</span>
                <div>
                  <p className="text-sm font-medium">DAO Governance</p>
                  <p className="text-xs text-muted-foreground">Decentralized voting system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="p-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{templates.length}</p>
            <p className="text-xs text-muted-foreground">Templates</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">Audited</p>
          </div>
        </div>
      </div>
    </div>
  );
};