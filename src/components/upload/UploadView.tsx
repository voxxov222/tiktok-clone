import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { blink } from '../../lib/blink';
import { useBlinkAuth } from '@blinkdotnew/react';
import { toast } from 'react-hot-toast';

interface UploadViewProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function UploadView({ onComplete, onCancel }: UploadViewProps) {
  const { user } = useBlinkAuth();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
      } else {
        toast.error('Please select a video file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // 1. Upload to Storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `videos/${user.id}-${Date.now()}.${file.name.split('.').pop()}`,
        {
          onProgress: (percent) => setUploadProgress(percent)
        }
      );

      // 2. Create DB Record
      await blink.db.videos.create({
        userId: user.id,
        videoUrl: publicUrl,
        description,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0
      });

      toast.success('Video uploaded successfully!');
      onComplete();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full w-full bg-black flex flex-col p-6 text-white animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Post Video</h2>
        <div className="w-10" />
      </div>

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="p-4 bg-white/5 rounded-full">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Select video to upload</p>
            <p className="text-white/50 text-sm mt-1">Or drag and drop a file</p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="video/*" 
            className="hidden" 
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative aspect-[9/16] max-h-[400px] bg-white/5 rounded-2xl overflow-hidden self-center border border-white/10">
            <video 
              src={URL.createObjectURL(file)} 
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
            />
            <button 
              onClick={() => setFile(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none h-24"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading {uploadProgress}%</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Post Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
