'use client';

import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const KS_VIDEO =
  'https://res.cloudinary.com/dkc1pmbma/video/upload/q_auto/f_auto/v1781479317/Kootenay_Signal_had0pr.mp4';

interface VideoHighlightProps {
  src?: string;
  poster?: string;
  label?: string;
  /** cinematic = full-bleed banner with bottom fade; framed = contained card */
  variant?: 'cinematic' | 'framed';
  align?: 'left' | 'center';
  className?: string;
}

export default function VideoHighlight({
  src = KS_VIDEO,
  poster,
  label,
  variant = 'cinematic',
  align = 'left',
  className = '',
}: VideoHighlightProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  const isCinematic = variant === 'cinematic';

  return (
    <div
      className={[
        'video-highlight',
        isCinematic ? 'video-highlight--cinematic' : 'video-highlight--framed',
        align === 'center' ? 'video-highlight--center' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {label && (
        <div className="video-highlight__label">
          <span className="video-highlight__label-line" />
          <span className="video-highlight__label-text">{label}</span>
        </div>
      )}

      <div className="video-highlight__stage">
        {!isCinematic && <div className="video-highlight__halo" aria-hidden="true" />}

        <div className="video-highlight__screen">
          <video
            ref={videoRef}
            className="video-highlight__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src={src} type="video/mp4" />
          </video>

          <div className="video-highlight__shade" aria-hidden="true" />
          <div className="video-highlight__grain" aria-hidden="true" />

          <button
            type="button"
            className="video-highlight__mute"
            onClick={toggleSound}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? <VolumeX size={16} strokeWidth={2.25} /> : <Volume2 size={16} strokeWidth={2.25} />}
          </button>
        </div>
      </div>
    </div>
  );
}
