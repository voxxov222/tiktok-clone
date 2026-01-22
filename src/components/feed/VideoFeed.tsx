import { useEffect, useRef, useState } from 'react';
import { Video } from '../../types';
import { VideoItem } from './VideoItem';

interface VideoFeedProps {
  videos: Video[];
}

export function VideoFeed({ videos }: VideoFeedProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVideoId(entry.target.getAttribute('data-id'));
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = feedRef.current?.querySelectorAll('[data-id]');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, [videos]);

  return (
    <div 
      ref={feedRef}
      className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
    >
      {videos.map((video) => (
        <div key={video.id} data-id={video.id} className="h-full w-full snap-start">
          <VideoItem 
            video={video} 
            isActive={activeVideoId === video.id} 
          />
        </div>
      ))}
    </div>
  );
}
