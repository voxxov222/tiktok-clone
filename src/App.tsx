import { useState, useEffect } from 'react';
import { VideoFeed } from './components/feed/VideoFeed';
import { BottomNav } from './components/layout/BottomNav';
import { TopTabs } from './components/layout/TopTabs';
import { UploadView } from './components/upload/UploadView';
import { DiscoveryView } from './components/discovery/DiscoveryView';
import { ProfileView } from './components/profile/ProfileView';
import { Video, User } from './types';
import { blink } from './lib/blink';
import { useBlinkAuth } from '@blinkdotnew/react';

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    userId: 'u1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-alone-34087-large.mp4',
    description: 'Neon dancing vibes ✨ #dance #neon #vibes',
    likesCount: 1200,
    commentsCount: 85,
    sharesCount: 45,
    createdAt: new Date().toISOString(),
    user: {
      id: 'u1',
      username: 'neon_dancer',
      displayName: 'Neon Dancer',
      avatarUrl: 'https://i.pravatar.cc/150?u=u1'
    }
  },
  {
    id: '2',
    userId: 'u2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-leaves-low-angle-shot-1881-large.mp4',
    description: 'Autumn is finally here 🍂 #autumn #nature #peaceful',
    likesCount: 850,
    commentsCount: 32,
    sharesCount: 12,
    createdAt: new Date().toISOString(),
    user: {
      id: 'u2',
      username: 'nature_lover',
      displayName: 'Nature Lover',
      avatarUrl: 'https://i.pravatar.cc/150?u=u2'
    }
  },
  {
    id: '3',
    userId: 'u3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skate-park-skater-doing-tricks-4475-large.mp4',
    description: 'Skate or die! 🛹 #skate #tricks #extreme',
    likesCount: 2500,
    commentsCount: 120,
    sharesCount: 88,
    createdAt: new Date().toISOString(),
    user: {
      id: 'u3',
      username: 'skate_master',
      displayName: 'Skate Master',
      avatarUrl: 'https://i.pravatar.cc/150?u=u3'
    }
  }
];

export default function App() {
  const { user, isAuthenticated, isLoading: authLoading } = useBlinkAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [feedTab, setFeedTab] = useState<'following' | 'foryou'>('foryou');
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);

  const refreshVideos = async () => {
    try {
      const dbVideos = await blink.db.videos.list({
        orderBy: { createdAt: 'desc' },
        limit: 20
      });
      
      const formattedVideos = dbVideos.map(v => ({
        ...v,
        user: {
          id: v.userId,
          username: 'user_' + v.userId.slice(0, 5),
          displayName: 'TikTok User',
          avatarUrl: `https://i.pravatar.cc/150?u=${v.userId}`
        }
      })) as Video[];
      
      setVideos([...formattedVideos, ...MOCK_VIDEOS]);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    }
  };

  useEffect(() => {
    refreshVideos();
  }, []);

  if (authLoading) return null;

  const currentUser: User | null = user ? {
    id: user.id,
    username: user.displayName || user.email?.split('@')[0] || 'user',
    displayName: user.displayName || 'TikTok User',
    avatarUrl: user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`,
    bio: user.metadata?.bio as string || ''
  } : null;

  return (
    <div className="h-screen w-full bg-black overflow-hidden font-sans flex flex-col items-center">
      <div className="relative h-full w-full max-w-[500px] bg-black shadow-2xl overflow-hidden">
        {activeTab === 'home' && (
          <>
            <TopTabs activeTab={feedTab} onTabChange={setFeedTab} />
            <VideoFeed videos={videos} />
          </>
        )}

        {activeTab === 'discover' && (
          <DiscoveryView videos={videos} />
        )}

        {activeTab === 'profile' && (
          !isAuthenticated ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-white bg-zinc-900 px-8 text-center gap-4">
              <p className="text-white/60">Log in to see your profile and shared videos</p>
              <button 
                onClick={() => blink.auth.login(window.location.href)}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg active:scale-95 transition-all"
              >
                Sign In
              </button>
            </div>
          ) : (
            <ProfileView 
              user={currentUser!} 
              videos={videos} 
              onSignOut={() => blink.auth.signOut()} 
            />
          )
        )}

        {activeTab === 'upload' && (
          !isAuthenticated ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-white bg-zinc-900 px-8 text-center gap-4">
              <p className="text-white/60">Log in to upload videos and share with others</p>
              <button 
                onClick={() => blink.auth.login(window.location.href)}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg active:scale-95 transition-all"
              >
                Sign In
              </button>
            </div>
          ) : (
            <UploadView 
              onComplete={() => {
                setActiveTab('home');
                refreshVideos();
              }} 
              onCancel={() => setActiveTab('home')} 
            />
          )
        )}

        {activeTab === 'inbox' && (
          <div className="h-full w-full flex flex-col items-center justify-center text-white bg-zinc-900 px-8 text-center gap-4">
            <h2 className="text-2xl font-bold">Inbox</h2>
            <p className="text-white/60">Messages and notifications will appear here</p>
          </div>
        )}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
 