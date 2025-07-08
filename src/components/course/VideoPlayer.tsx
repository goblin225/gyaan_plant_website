import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  courseId: string;
  lessonId: string;
  onStart?: () => void;
  onEnd?: () => void;
  onComplete?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  courseId,
  lessonId,
  onStart,
  onEnd,
  onComplete
}) => {
  const playerRef = useRef<any>(null);
  const containerId = `yt-player-${lessonId}`;

  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(src);

  useEffect(() => {
    if (!videoId) {
      console.warn('No valid videoId found from URL');
      return;
    }

    const loadYouTubeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    };

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        events: {
          onStateChange: (event: any) => {
            const state = event.data;

            switch (state) {
              case window.YT.PlayerState.PLAYING:
                onStart?.();
                break;

              case window.YT.PlayerState.ENDED:
                onEnd?.();
                onComplete?.();
                break;

              default:
            }
          }
        }
      });
    };

    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    if (!window.YT) {
      loadYouTubeAPI();
    } else {
      createPlayer();
    }

    return () => {
      playerRef.current?.destroy?.();
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <div id={containerId} className="w-full h-full" />

      <div className="absolute top-4 left-4 text-white bg-black/60 px-3 py-1 rounded">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </div>
  );
};