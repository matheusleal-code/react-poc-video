import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [error, setError] = useState(null);
  const [mimeType, setMimeType] = useState('');

  useEffect(() => {
    // Detectar o tipo MIME suportado
    const types = [
      'video/webm',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm;codecs=h264',
      'video/mp4',
    ];

    for (let type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        setMimeType(type);
        console.log('Usando tipo MIME:', type);
        break;
      }
    }

    if (!mimeType) {
      setError('Nenhum tipo MIME suportado encontrado para gravação de vídeo.');
    }
  }, []);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const startCapture = useCallback(() => {
    setCapturing(true);
    try {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: mimeType
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Erro ao iniciar a gravação:', error);
      setError(`Erro ao iniciar a gravação: ${error.message}`);
      setCapturing(false);
    }
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable, mimeType]);

  const stopCapture = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: mimeType
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = `react-webcam-stream-capture.${mimeType.split('/')[1]}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks, mimeType]);

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
        videoConstraints={videoConstraints}
        className="w-full max-w-md mb-4"
      />
      <div className="flex justify-center space-x-4">
        {capturing ? (
          <button
            onClick={stopCapture}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Parar Gravação
          </button>
        ) : (
          <button
            onClick={startCapture}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!mimeType}
          >
            Iniciar Gravação
          </button>
        )}
        {recordedChunks.length > 0 && (
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Baixar
          </button>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Tipo MIME detectado: {mimeType || 'Nenhum'}
      </div>
    </div>
  );
};

export default WebcamRecorder;