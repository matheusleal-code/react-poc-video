import React, { useState, useRef } from 'react';

const SimpleThumbnailTest = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setError(null);
    } else {
      setError('Por favor, selecione um arquivo de vídeo válido.');
      setVideoFile(null);
    }
  };

  const generateThumbnail = () => {
    if (!videoFile) {
      setError('Nenhum vídeo selecionado.');
      return;
    }

    const video = videoRef.current;
    video.src = URL.createObjectURL(videoFile);
    
    video.onloadeddata = () => {
      video.currentTime = 1; // Captura o frame após 1 segundo
    };
    
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setThumbnailUrl(url);
          setError(null);
        } else {
          setError('Falha ao gerar thumbnail.');
        }
      }, 'image/jpeg', 0.75);
    };
    
    video.onerror = () => {
      setError('Erro ao carregar o vídeo.');
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Geração de Thumbnail</h1>
      
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileChange} 
        className="mb-4"
      />
      
      <button 
        onClick={generateThumbnail}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        disabled={!videoFile}
      >
        Gerar Thumbnail
      </button>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}
      
      
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Thumbnail Gerada:</h2>
          <img src={thumbnailUrl} alt="Thumbnail" className="max-w-md" />
        </div>
      

      <video ref={videoRef} style={{display: 'none'}} />
    </div>
  );
};

export default SimpleThumbnailTest;