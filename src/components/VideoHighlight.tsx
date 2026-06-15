'use client';

import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const KS_VIDEO =
  'https://res.cloudinary.com/dkc1pmbma/video/upload/q_auto/f_auto/v1781479317/Kootenay_Signal_had0pr.mp4';

interface VideoHighlightProps {
  src?: string;
  poster?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  /** small label for the framed variant (alias of eyebrow) */
  label?: string;
  /** cinematic = spotlit showcase section; framed = contained card */
  variant?: 'cinematic' | 'framed';
  /** add top padding to clear the fixed navbar (cinematic only) */
  offsetNav?: boolean;
  className?: string;
}

export default function VideoHighlight({
  src = KS_VIDEO,
  poster,
  eyebrow,
  heading,
  subheading,
  label,
  variant = 'cinematic',
  offsetNav = true,
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
  const eyebrowText = eyebrow ?? label;

  const header =
    eyebrowText || heading || subheading ? (
      <div className="video-showcase__header">
        {eyebrowText && (
          <div className="video-showcase__eyebrow">
            <span className="video-showcase__eyebrow-line" />
            <span className="video-showcase__eyebrow-text">{eyebrowText}</span>
            <span className="video-showcase__eyebrow-line" />
          </div>
        )}
        {heading && <h2 className="video-showcase__heading">{heading}</h2>}
        {subheading && <p className="video-showcase__sub">{subheading}</p>}
      </div>
    ) : null;

  const screen = (
    <div className="video-showcase__screen">
      <video
        ref={videoRef}
        className="video-showcase__video"
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
      <div className="video-showcase__grain" aria-hidden="true" />
      <div className="video-showcase__edge" aria-hidden="true" />
      <button
        type="button"
        className="video-showcase__mute"
        onClick={toggleSound}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
      >
        {muted ? <VolumeX size={16} strokeWidth={2.25} /> : <Volume2 size={16} strokeWidth={2.25} />}
      </button>
    </div>
  );

  if (!isCinematic) {
    return (
      <div className={`video-showcase video-showcase--framed${className ? ` ${className}` : ''}`}>
        {header}
        <div className="video-showcase__stage">
          <div className="video-showcase__halo" aria-hidden="true" />
          {screen}
        </div>
      </div>
    );
  }

  return (
    <section
      className={[
        'video-showcase',
        'video-showcase--cinematic',
        offsetNav ? 'video-showcase--nav' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Kootenay Signal showcase video"
    >
      <div className="video-showcase__beam" aria-hidden="true" />
      <div className="video-showcase__pool" aria-hidden="true" />
      {header}
      <div className="video-showcase__stage">{screen}</div>
    </section>
  );
}
