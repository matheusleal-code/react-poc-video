import { useRef } from 'react';
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
              src="https://edisciplinas.usp.br/pluginfile.php/5196653/mod_resource/content/1/V%C3%ADdeo.mp4"
              controls={false}
              playsInline
              style={{ width: "50%"}}
              ref={videoRef}
              poster="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/477px-PNG_Test.png?20240730205008"
            ></video>
      <WebcamRecorder />
      <button onClick={startVideoAndRecording}>Iniciar video</button>
    </div>
  );
}

export default App;
