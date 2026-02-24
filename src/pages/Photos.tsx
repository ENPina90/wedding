import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";

type CloudinaryListResource = {
  asset_id: string;
  secure_url: string;
};

type CloudinaryListResponse = {
  resources: CloudinaryListResource[];
};

export default function Photos() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<CloudinaryListResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
    | string
    | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
    | string
    | undefined;
  const galleryTag =
    (import.meta.env.VITE_CLOUDINARY_GALLERY_TAG as string | undefined) ||
    "wedding-gallery";

  const uploadConfigError = useMemo(() => {
    if (!cloudName || !uploadPreset) {
      return "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your environment.";
    }
    return "";
  }, [cloudName, uploadPreset]);

  useEffect(() => {
    let isMounted = true;
    const loadPhotos = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await fetch(`/api/photos?tag=${encodeURIComponent(galleryTag)}&cb=${Date.now()}`);
        if (!response.ok) {
          throw new Error("Unable to load photos from Cloudinary.");
        }
        const data = (await response.json()) as CloudinaryListResponse;
        if (isMounted) {
          setPhotos(data.resources ?? []);
        }
      } catch {
        if (isMounted) {
          setErrorMessage(
            "We could not load the photo gallery right now. Please try again shortly.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPhotos();
    return () => {
      isMounted = false;
    };
  }, [galleryTag]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !cloudName || !uploadPreset || uploadConfigError) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", uploadPreset);
      formData.append("tags", galleryTag);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const uploaded = (await response.json()) as CloudinaryListResource;
      setPhotos((current) => [uploaded, ...current]);
    } catch {
      setErrorMessage(
        "Upload failed. Please try again or verify your Cloudinary upload preset settings.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      {/* Flower logos above header - smaller on mobile */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-[35px]">
        <FlowerLogo color="green" />
      </div>

      {/* Photo Gallery header */}
      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum tracking-[2.24px] italic">
          Photo Gallery
        </h2>
        <p className="font-body text-plum/70 text-base sm:text-lg mt-2 sm:mt-3">
          Moments from our journey together
        </p>
      </div>

      {/* Section divider with flower_center.svg */}
      <SectionDivider />

      {/* Masonry-style grid */}
      {isLoading ? (
        <p className="font-body text-center text-plum/80 mt-6">Loading photos...</p>
      ) : (
        <>
          {photos.length === 0 ? (
            <p className="font-body text-center text-plum/80 mt-6">
              No photos yet. Be the first to upload one.
            </p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.asset_id}
                  className="rounded-lg sm:rounded-xl overflow-hidden border border-pink/20 break-inside-avoid mb-3 sm:mb-4"
                >
                  <img
                    src={photo.secure_url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Upload prompt */}
      <div className="text-center mt-8 sm:mt-12 p-5 sm:p-8 bg-cream rounded-xl border border-pink/30">
        <span className="text-2xl sm:text-3xl block mb-2 sm:mb-3">📸</span>
        <h3 className="font-display text-plum text-lg sm:text-xl tracking-[1.68px] italic mb-2">
          Share Your Photos
        </h3>
        <p className="font-body text-plum/70 leading-7 max-w-md mx-auto mb-3 sm:mb-4">
          Took some great shots at the wedding? We'd love to see them! Upload
          your photos to our shared album.
        </p>
        <button
          type="button"
          onClick={onUploadClick}
          disabled={Boolean(uploadConfigError) || isUploading}
          className="inline-block bg-coral hover:bg-coral-hover active:bg-coral-active disabled:opacity-60 disabled:cursor-not-allowed text-white font-body font-bold text-sm tracking-[1.92px] px-6 py-3 rounded-lg transition-colors"
        >
          {isUploading ? "UPLOADING..." : "UPLOAD PHOTOS"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        {errorMessage && (
          <p className="font-body text-sm text-plum/80 mt-3">{errorMessage}</p>
        )}
        {uploadConfigError && (
          <p className="font-body text-sm text-plum/80 mt-3">{uploadConfigError}</p>
        )}
      </div>
    </div>
  );
}
