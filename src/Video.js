import React, { useEffect, useState, useRef } from "react";
import "./index.css";

const Video = () => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const preloadResources = async () => {
      try {
        // Pré-carregamento da thumbnail
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = 'https://dummyimage.com/300x200/000/fff';
        });

        setIsVideoReady(true);
      } catch (err) {
        console.error("Erro ao carregar recursos:", err);
      }
    };

    preloadResources();
  }, []);

  const handleCanPlay = () => {
    console.log("Vídeo pode ser reproduzido");
  };

  return (
    <div>
      {isVideoReady && (
        <video
          ref={videoRef}
          src="https://seenow-destination.s3.amazonaws.com/videos/ccd1df03-99e7-4269-9e9b-9cd6e763cfb3.mp4"
          controls={true}
          playsInline
          preload="auto" // Alterado de "metadata" para "auto"
          onCanPlay={handleCanPlay}
        />
      )}
    </div>
  );
};

export default Video;