import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Share2, Music2 } from 'lucide-react';
import { Video } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface VideoItemProps {
  video: Video;
  isActive: boolean;
}

export function VideoItem({ video, isActive }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(err => console.log('Autoplay blocked:', err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full bg-black snap-start flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={false}
      />

      {/* Overlay Information */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Action Sidebar */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-20">
        <div className="flex flex-col items-center gap-1">
          <div className="relative mb-2">
            <Avatar className="w-12 h-12 border-2 border-white">
              <AvatarImage src={video.user?.avatarUrl} />
              <AvatarFallback>{video.user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary rounded-full p-0.5">
              <PlusSquare className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-3 rounded-full bg-white/10 transition-transform active:scale-125 ${isLiked ? 'text-primary' : 'text-white'}`}>
            <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-xs font-semibold text-white">{video.likesCount + (isLiked ? 1 : 0)}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-white/10 text-white transition-transform active:scale-125">
            <MessageCircle className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-white">{video.commentsCount}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-white/10 text-white transition-transform active:scale-125">
            <Share2 className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-white">{video.sharesCount}</span>
        </button>

        <div className="animate-spin-slow">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 flex items-center justify-center border-[8px] border-white/10">
            <div className="w-6 h-6 rounded-full bg-black/50" />
          </div>
        </div>
      </div>

      {/* Video Info (Left Bottom) */}
      <div className="absolute left-4 bottom-20 right-20 z-20 text-white">
        <h3 className="font-bold text-lg mb-2">@{video.user?.username}</h3>
        <p className="text-sm line-clamp-2 mb-4 leading-relaxed">
          {video.description}
        </p>
        <div className="flex items-center gap-2 max-w-full overflow-hidden">
          <Music2 className="w-4 h-4 flex-shrink-0" />
          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee whitespace-nowrap text-sm">
              Original Sound - {video.user?.displayName || video.user?.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusSquare({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
