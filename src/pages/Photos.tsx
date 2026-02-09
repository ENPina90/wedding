import SectionDivider from "../components/SectionDivider";
import flowerLogosGreen from "../assets/flower_logos_green.png";
import img0001 from "../assets/photos/IMG_0001.jpg";
import img0276 from "../assets/photos/IMG_0276.jpg";
import img1025 from "../assets/photos/IMG_1025.jpg";
import img1322 from "../assets/photos/IMG_1322.jpg";
import img1891 from "../assets/photos/IMG_1891.jpg";
import img2056 from "../assets/photos/IMG_2056.jpg";
import img2177 from "../assets/photos/IMG_2177.jpg";
import img2415 from "../assets/photos/IMG_2415.jpg";
import img3220 from "../assets/photos/IMG_3220.jpg";
import img3294 from "../assets/photos/IMG_3294.jpg";
import img3311 from "../assets/photos/IMG_3311.JPG";
import img3781 from "../assets/photos/IMG_3781.jpg";
import img3972 from "../assets/photos/IMG_3972.jpg";
import img4848 from "../assets/photos/IMG_4848.jpg";
import img4881 from "../assets/photos/IMG_4881.jpg";
import img8381 from "../assets/photos/IMG_8381.jpg";
import img9571 from "../assets/photos/IMG_9571.jpg";
import img9639 from "../assets/photos/IMG_9639.jpg";
import img9736 from "../assets/photos/IMG_9736.jpg";
import img9932 from "../assets/photos/IMG_9932.jpg";
import img9933 from "../assets/photos/IMG_9933.jpg";
import pxl20250818 from "../assets/photos/PXL_20250818_160527974_Original.JPG";

const photos = [
  { src: img0001, alt: "Photo 1" },
  { src: img0276, alt: "Photo 2" },
  { src: img1025, alt: "Photo 3" },
  { src: img1322, alt: "Photo 4" },
  { src: img1891, alt: "Photo 5" },
  { src: img2056, alt: "Photo 6" },
  { src: img2177, alt: "Photo 7" },
  { src: img2415, alt: "Photo 8" },
  { src: img3220, alt: "Photo 9" },
  { src: img3294, alt: "Photo 10" },
  { src: img3311, alt: "Photo 11" },
  { src: img3781, alt: "Photo 12" },
  { src: img3972, alt: "Photo 13" },
  { src: img4848, alt: "Photo 14" },
  { src: img4881, alt: "Photo 15" },
  { src: img8381, alt: "Photo 16" },
  { src: img9571, alt: "Photo 17" },
  { src: img9639, alt: "Photo 18" },
  { src: img9736, alt: "Photo 19" },
  { src: img9932, alt: "Photo 20" },
  { src: img9933, alt: "Photo 21" },
  { src: pxl20250818, alt: "Photo 22" },
];

export default function Photos() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      {/* Flower logos above header */}
      <div className="flex justify-center items-center gap-6 md:gap-8 pt-6 pb-4">
        <img
          src={flowerLogosGreen}
          alt=""
          className="h-16 md:h-20 w-auto object-contain"
        />
      </div>

      {/* Photo Gallery header */}
      <div className="text-center pb-8">
        <h2 className="font-display text-plum text-3xl md:text-4xl tracking-[2.24px] italic">
          Photo Gallery
        </h2>
        <p className="font-body text-plum/70 text-lg mt-3">
          Moments from our journey together
        </p>
      </div>

      {/* Section divider with flowers_center.png */}
      <SectionDivider />

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden border border-pink/20 break-inside-avoid mb-4"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Upload prompt */}
      <div className="text-center mt-12 p-8 bg-cream rounded-xl border border-pink/30">
        <span className="text-3xl block mb-3">📸</span>
        <h3 className="font-display text-plum text-xl tracking-[1.68px] italic mb-2">
          Share Your Photos
        </h3>
        <p className="font-body text-plum/70 text-base leading-7 max-w-md mx-auto mb-4">
          Took some great shots at the wedding? We'd love to see them! Upload
          your photos to our shared album.
        </p>
        <a
          href="#"
          className="inline-block bg-coral hover:bg-coral-hover active:bg-coral-active text-white font-body font-bold text-sm tracking-[1.92px] px-6 py-3 rounded-lg transition-colors"
        >
          UPLOAD PHOTOS
        </a>
      </div>
    </div>
  );
}
