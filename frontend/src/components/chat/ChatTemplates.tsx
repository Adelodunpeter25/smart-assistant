import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, FileText, CheckSquare, Timer, Calculator, DollarSign, X, ChevronDown } from 'lucide-react';

export type ChatTemplate = 'search_web' | 'save_note' | 'create_task' | 'set_timer' | 'calculate' | 'convert_currency';

interface ChatTemplatesProps {
  selected: ChatTemplate | null;
  onSelect: (template: ChatTemplate) => void;
  onCancel: () => void;
}

const templates = [
  { id: 'search_web' as ChatTemplate, label: 'Search Web', icon: Search },
  { id: 'save_note' as ChatTemplate, label: 'Save Note', icon: FileText },
  { id: 'create_task' as ChatTemplate, label: 'Create Task', icon: CheckSquare },
  { id: 'set_timer' as ChatTemplate, label: 'Set Timer', icon: Timer },
  { id: 'calculate' as ChatTemplate, label: 'Calculate', icon: Calculator },
  { id: 'convert_currency' as ChatTemplate, label: 'Convert Currency', icon: DollarSign },
];

export const ChatTemplates = memo(({ selected, onSelect, onCancel }: ChatTemplatesProps) => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(false)}
        >
          <ChevronDown className="w-4 h-4 mr-2" />
          Show Templates
        </Button>
      </div>
    );
  }

  if (selected) {
    const selectedTemplate = templates.find(t => t.id === selected);
    if (!selectedTemplate) return null;

    const Icon = selectedTemplate.icon;
    return (
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-primary bg-primary/10"
        >
          <Icon className="w-4 h-4 mr-2" />
          {selectedTemplate.label}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCancel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Quick Actions</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCollapsed(true)}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              onClick={() => onSelect(template.id)}
              className="hover:border-primary hover:bg-primary/5 hover:text-foreground"
            >
              <Icon className="w-4 h-4 mr-2" />
              {template.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

ChatTemplates.displayName = 'ChatTemplates';
