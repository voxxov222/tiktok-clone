import { Grid, Heart, Lock, Bookmark } from 'lucide-react';
import { User, Video } from '../../types';
import { blink } from '../../lib/blink';

interface ProfileViewProps {
  user: User;
  videos: Video[];
  onSignOut: () => void;
}

export function ProfileView({ user, videos, onSignOut }: ProfileViewProps) {
  const userVideos = videos.filter(v => v.userId === user.id);

  return (
    <div className="h-full w-full bg-black overflow-y-auto pb-20 text-white">
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <div className="relative mb-4">
          <img 
            src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
            className="w-24 h-24 rounded-full border-2 border-white/10" 
          />
        </div>
        <h2 className="text-xl font-bold mb-1">@{user.username}</h2>
        <p className="text-sm text-white/60 mb-6">{user.displayName}</p>

        <div className="flex items-center gap-8 mb-6">
          <div className="flex flex-col items-center">
            <span className="font-bold">120</span>
            <span className="text-xs text-white/40">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">8.5K</span>
            <span className="text-xs text-white/40">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">25.3K</span>
            <span className="text-xs text-white/40">Likes</span>
          </div>
        </div>

        <div className="flex gap-2 w-full max-w-[280px]">
          <button className="flex-1 bg-white/10 hover:bg-white/15 py-2.5 rounded-md font-semibold text-sm transition-colors">
            Edit profile
          </button>
          <button 
            onClick={onSignOut}
            className="flex-1 bg-primary hover:opacity-90 py-2.5 rounded-md font-semibold text-sm transition-colors"
          >
            Log Out
          </button>
        </div>

        <p className="mt-4 text-sm text-white/80 text-center max-w-[280px]">
          {user.bio || 'No bio yet.'}
        </p>
      </div>

      <div className="flex border-y border-white/10 sticky top-0 bg-black z-10">
        <button className="flex-1 flex items-center justify-center py-3 border-b-2 border-white">
          <Grid className="w-5 h-5" />
        </button>
        <button className="flex-1 flex items-center justify-center py-3 text-white/40">
          <Lock className="w-5 h-5" />
        </button>
        <button className="flex-1 flex items-center justify-center py-3 text-white/40">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="flex-1 flex items-center justify-center py-3 text-white/40">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {userVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 text-white/40">
          <Grid className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">No videos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 px-0.5 mt-0.5">
          {userVideos.map((video) => (
            <div key={video.id} className="aspect-[3/4] bg-white/5 relative group cursor-pointer overflow-hidden">
              <video 
                src={video.videoUrl} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                muted
              />
              <div className="absolute bottom-1 left-2 flex items-center gap-1 text-white text-[10px] font-bold">
                <span>▶</span>
                <span>{video.likesCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
