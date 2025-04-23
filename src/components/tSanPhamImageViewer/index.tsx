import React, { useState } from "react";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "react-image-lightbox/style.css";

interface Props {
  images: string[];
}

export const TSanPhamImageViewer: React.FC<Props> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.8)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                transition: "all 0.2s ease",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.8)";
              }}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.8)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                transition: "all 0.2s ease",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.8)";
              }}
            >
              <FaChevronRight />
            </button>
          </>
        )}
        <div
          style={{
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <img
            src={images[index]}
            alt={`Ảnh ${index + 1}`}
            style={{
              width: 300,
              maxHeight: 300,
              objectFit: "cover",
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
              transform: isImageHovered ? "scale(1.02)" : "scale(1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(0,0,0,0.6)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 12,
              fontSize: 14,
            }}
          >
            {index + 1} / {images.length}
          </div>
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={images[index]}
          nextSrc={images[(index + 1) % images.length]}
          prevSrc={images[(index - 1 + images.length) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={handlePrev}
          onMoveNextRequest={handleNext}
          enableZoom={true}
          imageTitle={`Ảnh ${index + 1} / ${images.length}`}
        />
      )}
    </div>
  );
};
