import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  images: string[];
}

export const TSanPhamImageViewer: React.FC<Props> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [images]);

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
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
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
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
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
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
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
              transition: "transform 0.3s ease",
              transform: isImageHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          {images.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 500,
                backdropFilter: "blur(4px)",
              }}
            >
              {index + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
