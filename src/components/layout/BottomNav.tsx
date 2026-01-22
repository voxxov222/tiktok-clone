import { Home, Search, PlusSquare, MessageSquare, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Search, label: 'Discover' },
    { id: 'upload', icon: PlusSquare, label: '', isAction: true },
    { id: 'inbox', icon: MessageSquare, label: 'Inbox' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-white/10 flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex items-center justify-center w-12 h-8 bg-white rounded-lg transition-transform active:scale-90"
            >
              <div className="absolute inset-0 bg-cyan-400 -translate-x-1 rounded-lg -z-10" />
              <div className="absolute inset-0 bg-primary translate-x-1 rounded-lg -z-10" />
              <Icon className="w-6 h-6 text-black" />
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
