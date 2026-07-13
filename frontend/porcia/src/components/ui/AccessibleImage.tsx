'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AccessibleImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

export function AccessibleImage({
  src,
  alt,
  title,
  width = 300,
  height = 400,
  priority = false,
  className = '',
  objectFit = 'cover',
  onLoad,
  onError,
}: AccessibleImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        title={title || alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit,
          width: '100%',
          height: '100%',
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
}
