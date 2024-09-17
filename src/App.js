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
      <video
              src="https://edisciplinas.usp.br/pluginfile.php/5196653/mod_resource/content/1/V%C3%ADdeo.mp4#t=0.001"
              controls={false}
              playsInline
              style={{ width: "50%"}}
              ref={videoRef}
            ></video>
      <SimpleThumbnailTest />
      <button onClick={startVideoAndRecording}>Iniciar video</button>
    </div>
  );
}

export default App;
