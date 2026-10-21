import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useVideoPlayer, VideoPlayer } from 'expo-video';

export interface VideoData {
  id: string;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  url: string;
  thumbnail?: string;
  channelAvatar?: string;
}

export interface PipContextType {
  player: VideoPlayer;
  currentVideo: VideoData | null;
  isOpen: boolean;
  isMinimized: boolean;
  playVideo: (video: VideoData) => void;
  minimizePlayer: () => void;
  expandPlayer: () => void;
  closePlayer: () => void;
  setIsMinimized: (minimized: boolean) => void;
}

const PipContext = createContext<PipContextType | undefined>(undefined);

export const PipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Global expo-video player instance
  const player = useVideoPlayer(currentVideo?.url ?? '', (p) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    let isCancelled = false;

    if (currentVideo && player) {
      player
        .replaceAsync(currentVideo.url)
        .then(() => {
          if (!isCancelled) {
            player.play();
          }
        })
        .catch(() => {
          if (!isCancelled) {
            player.play();
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [currentVideo]);

  const playVideo = useCallback((video: VideoData) => {
    setCurrentVideo(video);
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const minimizePlayer = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const expandPlayer = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const closePlayer = useCallback(() => {
    if (player) {
      player.pause();
    }
    setIsOpen(false);
    setIsMinimized(false);
    setCurrentVideo(null);
  }, [player]);

  return (
    <PipContext.Provider
      value={{
        player,
        currentVideo,
        isOpen,
        isMinimized,
        playVideo,
        minimizePlayer,
        expandPlayer,
        closePlayer,
        setIsMinimized,
      }}
    >
      {children}
    </PipContext.Provider>
  );
};

export const usePip = (): PipContextType => {
  const context = useContext(PipContext);
  if (!context) {
    throw new Error('usePip must be used within a PipProvider');
  }
  return context;
};
