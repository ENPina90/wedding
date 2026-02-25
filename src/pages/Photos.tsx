import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";

type CloudinaryListResource = {
  asset_id: string;
  public_id: string;
  secure_url: string;
  display_order?: number;
  alt_text?: string;
};

type CloudinaryListResponse = {
  resources: CloudinaryListResource[];
};

type PhotosProps = {
  showAdminControls?: boolean;
};

const photoTintColors = [
  "var(--color-burgundy)",
  "var(--color-plum)",
  "var(--color-pink)",
  "var(--color-blue-gray)",
  "var(--color-olive)",
  "var(--color-sage)",
  "var(--color-coral)",
];

const getRandomPhotoTintColor = () =>
  photoTintColors[Math.floor(Math.random() * photoTintColors.length)];

const getResponseErrorMessage = async (
  response: Response,
  fallbackMessage: string,
) => {
  try {
    const payload = (await response.json()) as { error?: string };
    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Ignore invalid error payloads and fall back to default messaging.
  }

  return fallbackMessage;
};

export default function Photos({ showAdminControls = false }: PhotosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStartOrderRef = useRef<string[]>([]);
  const tintColorByAssetIdRef = useRef<Map<string, string>>(new Map());

  const [photos, setPhotos] = useState<CloudinaryListResource[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<CloudinaryListResource[]>([]);
  const [selectedApprovedPhoto, setSelectedApprovedPhoto] =
    useState<CloudinaryListResource | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [approvingPublicId, setApprovingPublicId] = useState<string | null>(null);
  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);
  const [unapprovingPublicId, setUnapprovingPublicId] = useState<string | null>(null);
  const [savingCaptionPublicId, setSavingCaptionPublicId] = useState<string | null>(null);

  const [adminKey, setAdminKey] = useState("");
  const [captionDraft, setCaptionDraft] = useState("");
  const [captionStatus, setCaptionStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [draggingApprovedPublicId, setDraggingApprovedPublicId] = useState<
    string | null
  >(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
    | string
    | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
    | string
    | undefined;
  const galleryTag =
    (import.meta.env.VITE_CLOUDINARY_GALLERY_TAG as string | undefined) ||
    "wedding-gallery";
  const pendingTag =
    (import.meta.env.VITE_CLOUDINARY_PENDING_TAG as string | undefined) ||
    `${galleryTag}-pending`;

  const uploadConfigError = useMemo(() => {
    if (!cloudName || !uploadPreset) {
      return "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your environment.";
    }
    return "";
  }, [cloudName, uploadPreset]);

  const loadApprovedPhotos = async () => {
    const response = await fetch(`/api/photos?cb=${Date.now()}`);
    if (!response.ok) {
      throw new Error("Unable to load approved photos.");
    }
    const data = (await response.json()) as CloudinaryListResponse;
    return data.resources ?? [];
  };

  const loadPendingPhotos = async (key: string) => {
    const response = await fetch(`/api/photos/pending?cb=${Date.now()}`, {
      headers: {
        "X-Admin-Key": key,
      },
    });

    if (!response.ok) {
      throw new Error("Unable to load pending photos.");
    }

    const data = (await response.json()) as CloudinaryListResponse;
    return data.resources ?? [];
  };

  useEffect(() => {
    if (!showAdminControls) {
      return;
    }

    const savedKey = window.localStorage.getItem("photos_admin_key");
    if (savedKey) {
      setAdminKey(savedKey);
    }
  }, [showAdminControls]);

  useEffect(() => {
    if (!showAdminControls) {
      return;
    }

    window.localStorage.setItem("photos_admin_key", adminKey);
  }, [adminKey, showAdminControls]);

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const approved = await loadApprovedPhotos();
        if (isMounted) {
          setPhotos(approved);
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
  }, []);

  useEffect(() => {
    if (!showAdminControls) {
      return;
    }

    if (!adminKey.trim()) {
      setPendingPhotos([]);
      return;
    }

    let isMounted = true;

    const loadPending = async () => {
      setIsLoadingPending(true);
      try {
        const pending = await loadPendingPhotos(adminKey.trim());
        if (isMounted) {
          setPendingPhotos(pending);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Unable to load pending photos. Verify your admin key.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPending(false);
        }
      }
    };

    void loadPending();

    return () => {
      isMounted = false;
    };
  }, [adminKey, showAdminControls]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length || !cloudName || !uploadPreset || uploadConfigError) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const uploadedPhotos = await Promise.all(
        selectedFiles.map(async (selectedFile) => {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("upload_preset", uploadPreset);
          formData.append("tags", pendingTag);

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

          return (await response.json()) as CloudinaryListResource;
        }),
      );

      if (showAdminControls) {
        setPendingPhotos((current) => [...uploadedPhotos, ...current]);
      }

      setStatusMessage(
        `${uploadedPhotos.length} photo${uploadedPhotos.length === 1 ? "" : "s"} uploaded for approval.`,
      );
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

  const handleApprove = async (photo: CloudinaryListResource) => {
    if (!showAdminControls || !adminKey.trim()) {
      setErrorMessage("Enter admin key to approve photos.");
      return;
    }

    setApprovingPublicId(photo.public_id);
    setErrorMessage("");

    try {
      const response = await fetch("/api/photos/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey.trim(),
        },
        body: JSON.stringify({ publicId: photo.public_id }),
      });

      if (!response.ok) {
        const apiMessage = await getResponseErrorMessage(
          response,
          "Approve failed.",
        );
        throw new Error(apiMessage);
      }

      const [approved, pending] = await Promise.all([
        loadApprovedPhotos(),
        loadPendingPhotos(adminKey.trim()),
      ]);
      setPhotos(approved);
      setPendingPhotos(pending);
      setStatusMessage("Photo approved.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Approve failed. Verify the admin key and try again.";
      setErrorMessage(message);
    } finally {
      setApprovingPublicId(null);
    }
  };

  const handleDelete = async (photo: CloudinaryListResource) => {
    if (!showAdminControls || !adminKey.trim()) {
      setErrorMessage("Enter admin key to delete photos.");
      return;
    }

    setDeletingPublicId(photo.public_id);
    setErrorMessage("");

    try {
      const response = await fetch("/api/photos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey.trim(),
        },
        body: JSON.stringify({ publicId: photo.public_id }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setPhotos((current) =>
        current.filter((currentPhoto) => currentPhoto.asset_id !== photo.asset_id),
      );
      setPendingPhotos((current) =>
        current.filter((currentPhoto) => currentPhoto.asset_id !== photo.asset_id),
      );

      if (selectedApprovedPhoto?.asset_id === photo.asset_id) {
        setSelectedApprovedPhoto(null);
      }
    } catch {
      setErrorMessage("Delete failed. Verify the admin key and try again.");
    } finally {
      setDeletingPublicId(null);
    }
  };

  const handleUnapprove = async (photo: CloudinaryListResource) => {
    if (!showAdminControls || !adminKey.trim()) {
      setErrorMessage("Enter admin key to unapprove photos.");
      return;
    }

    setUnapprovingPublicId(photo.public_id);
    setErrorMessage("");

    try {
      const response = await fetch("/api/photos/unapprove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey.trim(),
        },
        body: JSON.stringify({ publicId: photo.public_id }),
      });

      if (!response.ok) {
        throw new Error("Unapprove failed");
      }

      setPhotos((current) =>
        current.filter((currentPhoto) => currentPhoto.asset_id !== photo.asset_id),
      );
      setPendingPhotos((current) => [photo, ...current]);

      if (selectedApprovedPhoto?.asset_id === photo.asset_id) {
        setSelectedApprovedPhoto(null);
      }
    } catch {
      setErrorMessage("Unapprove failed. Verify the admin key and try again.");
    } finally {
      setUnapprovingPublicId(null);
    }
  };

  const handleSaveCaption = async () => {
    if (!showAdminControls || !adminKey.trim() || !selectedApprovedPhoto) {
      return;
    }

    setSavingCaptionPublicId(selectedApprovedPhoto.public_id);
    setErrorMessage("");
    setCaptionStatus("");

    try {
      const response = await fetch("/api/photos/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey.trim(),
        },
        body: JSON.stringify({
          publicId: selectedApprovedPhoto.public_id,
          altText: captionDraft,
        }),
      });

      if (!response.ok) {
        throw new Error("Save caption failed");
      }

      setPhotos((current) =>
        current.map((photo) =>
          photo.asset_id === selectedApprovedPhoto.asset_id
            ? { ...photo, alt_text: captionDraft }
            : photo,
        ),
      );
      setSelectedApprovedPhoto((current) =>
        current ? { ...current, alt_text: captionDraft } : current,
      );
      setCaptionStatus("Saved");
      setStatusMessage("Caption saved.");
    } catch {
      setErrorMessage("Could not save caption. Verify admin key and try again.");
    } finally {
      setSavingCaptionPublicId(null);
    }
  };

  const persistApprovedOrder = async (orderedPublicIds: string[]) => {
    if (!showAdminControls || !adminKey.trim()) {
      return;
    }

    const response = await fetch("/api/photos/reorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": adminKey.trim(),
      },
      body: JSON.stringify({ orderedPublicIds }),
    });

    if (!response.ok) {
      throw new Error("Reorder failed");
    }
  };

  const handleApprovedDragStart = (publicId: string) => {
    if (!showAdminControls) {
      return;
    }

    dragStartOrderRef.current = photos.map((photo) => photo.public_id);
    setDraggingApprovedPublicId(publicId);
  };

  const handleApprovedDragOver = (
    event: DragEvent<HTMLDivElement>,
    overPublicId: string,
  ) => {
    if (!showAdminControls || !draggingApprovedPublicId) {
      return;
    }

    event.preventDefault();
    if (draggingApprovedPublicId === overPublicId) {
      return;
    }

    setPhotos((current) => {
      const draggingIndex = current.findIndex(
        (photo) => photo.public_id === draggingApprovedPublicId,
      );
      const overIndex = current.findIndex((photo) => photo.public_id === overPublicId);

      if (draggingIndex === -1 || overIndex === -1) {
        return current;
      }

      const next = [...current];
      const [draggingPhoto] = next.splice(draggingIndex, 1);
      next.splice(overIndex, 0, draggingPhoto);
      return next;
    });
  };

  const handleApprovedDragEnd = async () => {
    if (!showAdminControls || !draggingApprovedPublicId) {
      return;
    }

    setDraggingApprovedPublicId(null);
    const currentOrder = photos.map((photo) => photo.public_id);
    const startingOrder = dragStartOrderRef.current;
    const orderChanged =
      currentOrder.length === startingOrder.length &&
      currentOrder.some((publicId, index) => publicId !== startingOrder[index]);

    if (!orderChanged) {
      return;
    }

    try {
      await persistApprovedOrder(currentOrder);
      setStatusMessage("Approved photo order saved.");
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not save photo order. Verify admin key and try again.");
      setStatusMessage("");
    }
  };

  const openEditModal = (photo: CloudinaryListResource) => {
    setSelectedApprovedPhoto(photo);
    setCaptionDraft(photo.alt_text || "");
    setCaptionStatus("");
    setErrorMessage("");
  };

  const closeEditModal = () => {
    if (savingCaptionPublicId || deletingPublicId || unapprovingPublicId) {
      return;
    }

    setSelectedApprovedPhoto(null);
  };

  const getPhotoAlt = (photo: CloudinaryListResource, index: number) =>
    photo.alt_text?.trim() || `Photo ${index + 1}`;
  const getPhotoOverlayText = (photo: CloudinaryListResource) =>
    (photo.alt_text?.trim() || "").split(/\s+/).filter(Boolean).join("\n");

  const tintColorByAssetId = useMemo(() => {
    const next = new Map<string, string>();

    photos.forEach((photo) => {
      const existingColor = tintColorByAssetIdRef.current.get(photo.asset_id);
      next.set(photo.asset_id, existingColor ?? getRandomPhotoTintColor());
    });

    tintColorByAssetIdRef.current = next;
    return next;
  }, [photos]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-[35px]">
        <FlowerLogo color="green" />
      </div>

      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum tracking-[2.24px] italic">
          Photo Gallery
        </h2>
        <p className="font-body text-plum/70 text-base sm:text-lg mt-2 sm:mt-3">
          Moments from our journey together
        </p>
      </div>

      <SectionDivider />

      {showAdminControls && (
        <div className="mt-6 mb-8 p-5 sm:p-6 bg-cream rounded-xl border border-pink/30">
          <h3 className="font-display text-plum text-lg sm:text-xl tracking-[1.2px] italic mb-2">
            Admin Moderation
          </h3>
          <label htmlFor="admin-key" className="block font-body text-xs text-plum/75 mb-1">
            Admin Key
          </label>
          <input
            id="admin-key"
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            className="w-full max-w-md border border-pink/40 rounded-md px-3 py-2 text-sm font-body text-plum bg-white"
            placeholder="Enter admin key"
            autoComplete="off"
          />
          <p className="font-body text-xs text-plum/70 mt-2">
            Pending uploads appear below. Approve to publish on /photos.
          </p>
        </div>
      )}

      {showAdminControls && (
        <div className="mb-8">
          <h3 className="font-display text-plum text-lg sm:text-xl tracking-[1.2px] italic mb-3 text-center">
            Pending Approvals
          </h3>
          {isLoadingPending ? (
            <p className="font-body text-plum/80">Loading pending photos...</p>
          ) : pendingPhotos.length === 0 ? (
            <p className="font-body text-plum/80">No pending photos.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {pendingPhotos.map((photo) => (
                <div
                  key={photo.asset_id}
                  className="rounded-lg sm:rounded-xl overflow-hidden border border-pink/20 break-inside-avoid mb-3 sm:mb-4 relative"
                >
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleApprove(photo)}
                      disabled={
                        approvingPublicId === photo.public_id ||
                        deletingPublicId === photo.public_id ||
                        !adminKey.trim()
                      }
                      className="bg-green-700/90 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-body font-bold tracking-[1px] px-2 py-1 rounded"
                      aria-label="Approve photo"
                      title="Approve"
                    >
                      {approvingPublicId === photo.public_id ? "..." : "✓"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(photo)}
                      disabled={
                        deletingPublicId === photo.public_id ||
                        approvingPublicId === photo.public_id ||
                        !adminKey.trim()
                      }
                      className="bg-plum/85 hover:bg-plum active:bg-plum/95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-body font-bold tracking-[1px] px-2 py-1 rounded"
                      aria-label="Delete photo"
                      title="Delete"
                    >
                      {deletingPublicId === photo.public_id ? "..." : "✕"}
                    </button>
                  </div>
                  <img
                    src={photo.secure_url}
                    alt={photo.alt_text || "Pending upload"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAdminControls && (
        <h3 className="font-display text-plum text-lg sm:text-xl tracking-[1.2px] italic mb-3 text-center">
          Approved Photos
        </h3>
      )}

      {isLoading ? (
        <p className="font-body text-center text-plum/80 mt-6">Loading photos...</p>
      ) : (
        <>
          {photos.length === 0 ? (
            <p className="font-body text-center text-plum/80 mt-6">
              No approved photos yet.
            </p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {photos.map((photo, index) => {
                const overlayText = getPhotoOverlayText(photo);
                return (
                <div
                  key={photo.asset_id}
                  className={`group rounded-lg sm:rounded-xl overflow-hidden border border-pink/20 break-inside-avoid mb-3 sm:mb-4 relative ${showAdminControls ? "cursor-move" : ""}`}
                  draggable={showAdminControls}
                  onDragStart={() => handleApprovedDragStart(photo.public_id)}
                  onDragOver={(event) => handleApprovedDragOver(event, photo.public_id)}
                  onDragEnd={() => void handleApprovedDragEnd()}
                  onClick={() => {
                    if (showAdminControls) {
                      openEditModal(photo);
                    }
                  }}
                >
                  <img
                    src={photo.secure_url}
                    alt={getPhotoAlt(photo, index)}
                    title={photo.alt_text?.trim() || ""}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-70 group-focus-within:opacity-70"
                    style={{
                      backgroundColor:
                        tintColorByAssetId.get(photo.asset_id) || photoTintColors[0],
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    {overlayText && (
                      <p className="font-display whitespace-pre-line text-white text-3xl sm:text-4xl tracking-[1px] italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                        {overlayText}
                      </p>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <div className="text-center mt-8 sm:mt-12 p-5 sm:p-8 bg-cream rounded-xl border border-pink/30">
        <span className="text-2xl sm:text-3xl block mb-2 sm:mb-3">📸</span>
        <h3 className="font-display text-plum text-lg sm:text-xl tracking-[1.68px] italic mb-2">
          Share Your Photos
        </h3>
        <p className="font-body text-plum/70 leading-7 max-w-md mx-auto mb-3 sm:mb-4">
          Upload your photos to our shared album. New uploads are reviewed before
          appearing in the public gallery.
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
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        {statusMessage && (
          <p className="font-body text-sm text-plum/80 mt-3">{statusMessage}</p>
        )}
        {errorMessage && (
          <p className="font-body text-sm text-plum/80 mt-3">{errorMessage}</p>
        )}
        {uploadConfigError && (
          <p className="font-body text-sm text-plum/80 mt-3">{uploadConfigError}</p>
        )}
      </div>

      {showAdminControls && selectedApprovedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-3xl bg-cream rounded-xl border border-pink/40 p-4 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedApprovedPhoto.secure_url}
              alt={selectedApprovedPhoto.alt_text || "Approved photo"}
              className="w-full max-h-[60vh] object-contain rounded-lg border border-pink/20 bg-white"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={selectedApprovedPhoto.secure_url}
                download
                target="_blank"
                rel="noreferrer"
                className="bg-coral hover:bg-coral-hover active:bg-coral-active text-white font-body font-bold text-xs tracking-[1px] px-3 py-2 rounded"
              >
                DOWNLOAD
              </a>
              <button
                type="button"
                onClick={() => void handleUnapprove(selectedApprovedPhoto)}
                disabled={unapprovingPublicId === selectedApprovedPhoto.public_id}
                className="bg-green-700/90 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-body font-bold text-xs tracking-[1px] px-3 py-2 rounded"
              >
                {unapprovingPublicId === selectedApprovedPhoto.public_id
                  ? "UNAPPROVING..."
                  : "UNAPPROVE"}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(selectedApprovedPhoto)}
                disabled={deletingPublicId === selectedApprovedPhoto.public_id}
                className="bg-plum/85 hover:bg-plum active:bg-plum/95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-body font-bold text-sm tracking-[1px] px-3 py-2 rounded"
                aria-label="Delete photo"
                title="Delete"
              >
                {deletingPublicId === selectedApprovedPhoto.public_id ? "..." : "✕"}
              </button>
            </div>

            <div className="mt-4">
              <input
                id="photo-alt-text"
                type="text"
                value={captionDraft}
                onChange={(event) => {
                  setCaptionDraft(event.target.value);
                  setCaptionStatus("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSaveCaption();
                  }
                }}
                className="w-full border border-pink/40 rounded-md px-3 py-2 text-sm font-body text-plum bg-white"
                placeholder="add caption"
              />
              <p className="mt-2 font-body text-xs text-plum/80">
                {savingCaptionPublicId === selectedApprovedPhoto.public_id
                  ? "Saving..."
                  : captionStatus}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
