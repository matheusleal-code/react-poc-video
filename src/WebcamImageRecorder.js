import JSZip from 'jszip';
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebCamImageRecorder = () => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const captureIntervalRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImages((prevImages) => [...prevImages, imageSrc]);
    }
  }, [webcamRef]);

  const startCapture = useCallback(() => {
    setCapturing(true);
    captureIntervalRef.current = setInterval(() => {
      capture();
    }, 1000); // Captura uma imagem a cada segundo
  }, [capture]);

  const stopCapture = useCallback(() => {
    setCapturing(false);
    clearInterval(captureIntervalRef.current);
  }, []);

  const handleDownload = useCallback(() => {
    if (images.length > 0) {
      const zip = new JSZip();
      images.forEach((image, index) => {
        const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
        zip.file(`image_${index + 1}.jpg`, base64Data, { base64: true });
      });
      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "webcam-captures.zip";
        a.click();
        window.URL.revokeObjectURL(url);
      });
      setImages([]);
    }
  }, [images]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-full max-w-md mb-4"
      />
      <div className="flex justify-center space-x-4">
        {capturing ? (
          <button
            onClick={stopCapture}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Parar Captura
          </button>
        ) : (
          <button
            onClick={startCapture}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Iniciar Captura
          </button>
        )}
        {images.length > 0 && (
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Baixar Imagens
          </button>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Imagens capturadas: {images.length}
      </div>
    </div>
  );
};

export default WebCamImageRecorder;