import { useRef } from 'react';
import Video from './Video';
import WebCam from './WebCam';
import WebcamRecorder from './WebcamRecorder';
import SimpleThumbnailTest from './SimpleThumbnail';

function App() {
  const videoRef = useRef(null);

  const startVideoAndRecording = () => {
    if (videoRef.current) {
      videoRef.current.play(); // Inicia a reprodução do vídeo
    }
  };

  return (
    <div className="App">
      <Video></Video>
    </div>
  );
}

export default App;
