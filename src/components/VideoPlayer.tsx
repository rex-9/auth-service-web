import React from "react";

type VideoProps = {
  video: {
    src: string;
    alt: string;
    title: string;
  };
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: string;
  height?: string;
  className?: string;
};

const VideoPlayer: React.FC<VideoProps> = ({
  video,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  width = "100%",
  height = "auto",
  className = "",
}) => {
  return (
    <video
      className={className}
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      aria-label={video.alt}
      title={video.title}
    >
      <source src={video.src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
