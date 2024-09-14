import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import { v4 as uuid } from "uuid";
import Webcam from "react-webcam";

const WebCam = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mimeType, setMimeType] = useState('');

  useEffect(() => {
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
  }, []);
  
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

  useEffect(() => {
    handleDownload();
  }, [recordedChunks]);

  const init = () => {
    const requestCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
        setErrorMessage(null);
      } catch (error) {
        console.error(
          "Permissão para a câmera negada ou ocorreu um erro:",
          error
        );
        setErrorMessage("Câmera não encontrada ou permissão negada.");
      }
    };

    requestCameraAccess();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  };
  useEffect(() => {
    init();
  }, []);

  const startRecording = async () => {
    console.log('mimeType ', mimeType)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const options = { mimeType };
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
          const blob = new Blob([event.data], { type: mimeType });
          setVideoURL(URL.createObjectURL(blob));
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="mx-0 flex flex-1 justify-between overflow-hidden md:mx-14 md:my-auto">
      <div className="flex w-full flex-col items-center justify-between gap-4 md:justify-center">
        {!uploading && (
          <>
          <Webcam
            audio={true}
            ref={videoRef}
            muted
            autoPlay
            videoConstraints={{facingMode: "user"}}
            className="h-full aspect-mobile-video w-full overflow-hidden object-cover md:max-h-[70%] md:max-w-[50%] md:rounded-tl-xl md:rounded-tr-xl"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <div className="mb-3 md:mb-0">
              <button
                type="button"
                onClick={handleRecordClick}
                className="duration-400 rounded-full bg-gradient-to-r from-project-primary-main to-project-secondary-main hover:from-project-primary-800 hover:to-project-primary-main hover:transition"
                style={{ padding: "1rem" }}
              >
                {cameraEnabled ? (
                  isRecording ? (
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 stroke-white"
                    >
                      <path
                        d="M17 2.83325C9.17597 2.83325 2.83333 9.17589 2.83333 16.9999C2.83333 24.824 9.17597 31.1666 17 31.1666C24.824 31.1666 31.1667 24.824 31.1667 16.9999C31.1667 9.17589 24.824 2.83325 17 2.83325ZM0.333333 16.9999C0.333333 7.79517 7.79526 0.333252 17 0.333252C26.2047 0.333252 33.6667 7.79517 33.6667 16.9999C33.6667 26.2047 26.2047 33.6666 17 33.6666C7.79526 33.6666 0.333333 26.2047 0.333333 16.9999ZM10.3333 12.8333C10.3333 11.4525 11.4526 10.3333 12.8333 10.3333H21.1667C22.5474 10.3333 23.6667 11.4525 23.6667 12.8333V21.1666C23.6667 22.5473 22.5474 23.6666 21.1667 23.6666H12.8333C11.4526 23.6666 10.3333 22.5473 10.3333 21.1666V12.8333Z"
                        fill="#F4F3F6"
                      />
                    </svg>
                  ) : (
                    <div className="rounded-sm bg-white p-2"></div>
                  )
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-white"
                  >
                    <path
                      d="M4 5.27392C4 3.56707 5.82609 2.48176 7.32538 3.29755L19.687 10.0237C21.2531 10.8759 21.2531 13.1243 19.687 13.9764L7.32538 20.7026C5.82609 21.5184 4 20.4331 4 18.7262V5.27392Z"
                      fill="white"
                    />
                  </svg>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WebCam;
