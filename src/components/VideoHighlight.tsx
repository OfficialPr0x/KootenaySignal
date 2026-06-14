'use client';

import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const KOOTENAY_SIGNAL_VIDEO =
  'https://res.cloudinary.com/dkc1pmbma/video/upload/q_auto/f_auto/v1781479317/Kootenay_Signal_had0pr.mp4';

interface VideoHighlightProps {
  /** Add top padding for the fixed navbar (82px / 64px mobile). */
  offsetNav?: boolean;
  className?: string;
}

export default function VideoHighlight({ offsetNav = true, className = '' }: VideoHighlightProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    if (!next) video.play().catch(() => {});
    setMuted(next);
  };

  return (
    <section
      className={`video-highlight${offsetNav ? ' video-highlight--nav' : ''}${className ? ` ${className}` : ''}`}
      aria-label="Kootenay Signal showcase video"
    >
      <div className="video-highlight__ambient" aria-hidden="true" />
      <div className="video-highlight__inner">
        <div className="video-highlight__frame">
          <div className="video-highlight__bezel" aria-hidden="true" />
          <video
            ref={videoRef}
            className="video-highlight__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={KOOTENAY_SIGNAL_VIDEO} type="video/mp4" />
          </video>
          <div className="video-highlight__vignette" aria-hidden="true" />
          <div className="video-highlight__scanline" aria-hidden="true" />
          <button
            type="button"
            className="video-highlight__mute"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? <VolumeX size={15} strokeWidth={2} /> : <Volume2 size={15} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </section>
  );
}
