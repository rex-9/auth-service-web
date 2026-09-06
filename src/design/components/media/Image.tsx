import React, { useEffect, useState } from "react";
import { images } from "../../../assets";

export interface IImageAsset {
  src: string;
  alt: string;
  title?: string;
}

export interface IImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  asset?: IImageAsset;
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  onError?: () => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fallback?: React.ReactNode;
  showLoadingPlaceholder?: boolean;
}

const LOADED_IMAGES_CACHE = new Set<string>();

export const Image: React.FC<IImageProps> = ({
  asset,
  src,
  alt,
  title,
  className = "",
  onError,
  onLoad,
  fallback,
  showLoadingPlaceholder = true,
  loading = "eager",
  referrerPolicy = "no-referrer",
  ...rest
}) => {
  const finalSrc = asset?.src ?? src ?? "";
  const finalAlt = alt ?? asset?.alt ?? "";
  const finalTitle = title ?? asset?.title ?? finalAlt;
  const imgRef = React.useRef<HTMLImageElement>(null);

  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    return !showLoadingPlaceholder || (Boolean(finalSrc) && LOADED_IMAGES_CACHE.has(finalSrc));
  });

  useEffect(() => {
    if (!finalSrc) {
      setIsLoaded(false);
      setHasError(false);
      return;
    }

    if (LOADED_IMAGES_CACHE.has(finalSrc)) {
      setIsLoaded(true);
      setHasError(false);
      return;
    }

    const img = imgRef.current;
    if (img) {
      // Browser memory cache may have already loaded the image in 0ms before React attached listeners
      if (img.complete) {
        if (img.naturalWidth > 0) {
          LOADED_IMAGES_CACHE.add(finalSrc);
          setIsLoaded(true);
          setHasError(false);
          return;
        } else if (img.naturalWidth === 0 && img.src) {
          setHasError(true);
          setIsLoaded(true);
          return;
        }
      }

      const onNativeLoad = () => {
        LOADED_IMAGES_CACHE.add(finalSrc);
        setIsLoaded(true);
      };

      const onNativeError = () => {
        setHasError(true);
        setIsLoaded(true);
      };

      img.addEventListener("load", onNativeLoad);
      img.addEventListener("error", onNativeError);

      // Timeout fallback in case a remote image stalls indefinitely
      const timer = setTimeout(() => {
        setIsLoaded((currentLoaded) => {
          if (!currentLoaded) {
            setHasError(true);
            return true;
          }
          return currentLoaded;
        });
      }, 8000);

      return () => {
        img.removeEventListener("load", onNativeLoad);
        img.removeEventListener("error", onNativeError);
        clearTimeout(timer);
      };
    }

    setIsLoaded(false);
    setHasError(false);
  }, [finalSrc]);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    onError?.();
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (finalSrc) {
      LOADED_IMAGES_CACHE.add(finalSrc);
    }
    setIsLoaded(true);
    onLoad?.(e);
  };

  // Failed state
  if (hasError || !finalSrc) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <img
        src={images.error.src}
        alt={finalAlt || images.error.alt}
        title={finalTitle || images.error.title}
        aria-label={finalAlt || images.error.alt}
        className={`object-cover bg-base-300 select-none ${className}`}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      {/* Loading Placeholder */}
      {showLoadingPlaceholder && !isLoaded && (
        <img
          src={images.loading.src}
          alt={images.loading.alt}
          title={images.loading.title}
          className="absolute inset-0 w-full h-full object-cover animate-pulse select-none pointer-events-none"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Target Image */}
      <img
        ref={imgRef}
        src={finalSrc}
        alt={finalAlt}
        aria-label={finalAlt}
        title={finalTitle}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          !isLoaded && showLoadingPlaceholder ? "opacity-0" : "opacity-100"
        }`}
        loading={loading}
        referrerPolicy={referrerPolicy}
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  );
};

export const Asset = Image;

export default Image;
