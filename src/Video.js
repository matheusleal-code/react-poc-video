import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import { v4 as uuid } from "uuid";
import Webcam from "react-webcam";

const Video = () => {
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    const preloadResources = async () => {
      try {
        // Pré-carregamento da thumbnail
        const imgPromise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve();
          };
          img.onerror = reject;
          img.src = 'https://dummyimage.com/300x200/000/fff';
        });
        console.log('caiu ');
        // Pré-carregamento do vídeo
        const videoPromise = new Promise((resolve, reject) => {
          const video = document.createElement("video");
          video.preload = "auto";
          video.muted = true;
          video.oncanplaythrough = () => {
            setVideoElement(video);
            console.log('video ', video);
            resolve();
          };
          video.onerror = reject;
          video.src = 'https://seenow-destination.s3.amazonaws.com/videos/ccd1df03-99e7-4269-9e9b-9cd6e763cfb3.mp4';
        });
        await Promise.all([imgPromise, videoPromise]);
      } catch (err) {
        console.error("Erro ao buscar ou carregar dados do vídeo:", err);
      } 
    };

    preloadResources();
  }, []);

  return (
    <div>
      {videoElement && (
        <video src="https://seenow-destination.s3.amazonaws.com/videos/ccd1df03-99e7-4269-9e9b-9cd6e763cfb3.mp4" controls={true}></video>
      )}
    </div>
  );
};

export default Video;
