import { Search } from 'lucide-react';
import { Video } from '../../types';

interface DiscoveryViewProps {
  videos: Video[];
}

export function DiscoveryView({ videos }: DiscoveryViewProps) {
  return (
    <div className="h-full w-full bg-black overflow-y-auto pb-20">
      <div className="p-4 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {videos.map((video) => (
          <div key={video.id} className="aspect-[3/4] bg-white/5 relative group cursor-pointer overflow-hidden">
            <video 
              src={video.videoUrl} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              muted
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
            <div className="absolute bottom-1 left-2 flex items-center gap-1 text-white text-[10px] font-bold">
              <span>▶</span>
              <span>{video.likesCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
