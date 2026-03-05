// Low-opacity video overlay. Parent must have position: relative + overflow: hidden.
export default function VideoBackground({ src, opacity = 0.07 }: { src: string; opacity?: number }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
