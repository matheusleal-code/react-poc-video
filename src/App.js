import { useRef } from 'react';
import './App.css';
import Video from './Video';
import WebCam from './WebCam';
import WebcamRecorder from './WebcamRecorder';

function App() {
  const videoRef = useRef(null);

  const startVideoAndRecording = () => {
    if (videoRef.current) {
      videoRef.current.play(); // Inicia a reprodução do vídeo
    }
  };

  return (
    <div className="App">
      <video
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
              controls={false}
              playsInline
              style={{ width: "30%"}}
              ref={videoRef}
            ></video>
      <WebcamRecorder />
      <button onClick={startVideoAndRecording}>Iniciar video</button>
    </div>
  );
}

export default App;
