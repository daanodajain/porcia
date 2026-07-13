export type MediaKind = "image" | "video" | "auto";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"];

function stripQuery(value: string) {
  return value.split("?")[0]?.split("#")[0] ?? value;
}

export function inferMediaKind(src?: string | null): Exclude<MediaKind, "auto"> {
  if (!src) return "image";
  const clean = stripQuery(src).toLowerCase();
  if (VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext))) return "video";
  if (IMAGE_EXTENSIONS.some((ext) => clean.endsWith(ext))) return "image";
  return "image";
}

export function resolveBestMediaUrl(...candidates: Array<string | null | undefined>) {
  return candidates.find((candidate) => typeof candidate === "string" && candidate.trim().length > 0) ?? null;
}

