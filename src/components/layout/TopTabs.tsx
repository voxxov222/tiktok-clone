interface TopTabsProps {
  activeTab: 'following' | 'foryou';
  onTabChange: (tab: 'following' | 'foryou') => void;
}

export function TopTabs({ activeTab, onTabChange }: TopTabsProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-center gap-6 z-50 bg-gradient-to-b from-black/50 to-transparent">
      <button
        onClick={() => onTabChange('following')}
        className={`text-lg font-bold transition-all ${
          activeTab === 'following' ? 'text-white scale-110' : 'text-white/60 hover:text-white/80'
        }`}
      >
        Following
      </button>
      <div className="w-px h-3 bg-white/20" />
      <button
        onClick={() => onTabChange('foryou')}
        className={`text-lg font-bold transition-all ${
          activeTab === 'foryou' ? 'text-white scale-110' : 'text-white/60 hover:text-white/80'
        }`}
      >
        For You
      </button>
    </div>
  );
}
