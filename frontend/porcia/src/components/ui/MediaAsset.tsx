import Image from "next/image";
import type { CSSProperties } from "react";
import { inferMediaKind, type MediaKind } from "@/lib/media";

interface MediaAssetProps {
  src?: string | null;
  alt: string;
  kind?: MediaKind;
  className?: string;
  imageClassName?: string;
  videoClassName?: string;
  priority?: boolean;
  poster?: string | null;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  style?: CSSProperties;
  sizes?: string;
}

export function MediaAsset({
  src,
  alt,
  kind = "auto",
  className = "",
  imageClassName = "",
  videoClassName = "",
  priority = false,
  poster = null,
  controls = false,
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  style,
  sizes,
}: MediaAssetProps) {
  if (!src) return null;

  const resolvedKind: Exclude<MediaKind, "auto"> = kind === "auto" ? inferMediaKind(src) : kind;

  if (resolvedKind === "video") {
    return (
      <video
        className={`${className} ${videoClassName}`.trim()}
        poster={poster ?? undefined}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        style={style}
      >
        <source src={src} />
      </video>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={`${className} ${imageClassName}`.trim()}
      sizes={sizes}
      style={style}
    />
  );
}

