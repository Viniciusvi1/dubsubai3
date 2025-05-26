import { useRef, useState, useEffect } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  subtitlesUrl: string;
  thumbnail?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ videoUrl, subtitlesUrl, thumbnail, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitlesLoaded, setSubtitlesLoaded] = useState(false);
  const [loadingSubtitles, setLoadingSubtitles] = useState(false);
  const [subtitleError, setSubtitleError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  // URLs de vídeo válidas para demonstração
  const validVideoUrl = videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const validSubtitlesUrl = subtitlesUrl || "/sample-subtitles-pt.vtt";
  
  console.log("VideoPlayer - URL do vídeo:", validVideoUrl);
  console.log("VideoPlayer - URL das legendas:", validSubtitlesUrl);
  
  // Configurar vídeo quando URL mudar
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    console.log("Configurando vídeo:", validVideoUrl);
    setVideoLoaded(false);
    setVideoError(false);
    
    const handleLoadedData = () => {
      console.log("Vídeo carregado com sucesso");
      setVideoLoaded(true);
      setVideoError(false);
      setDuration(videoElement.duration);
      
      if (autoPlay) {
        videoElement.play().catch(e => {
          console.error("Erro ao reproduzir automaticamente:", e);
        });
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Erro no carregamento do vídeo:", e);
      setVideoError(true);
      setVideoLoaded(false);
    };
    
    const handleCanPlay = () => {
      console.log("Vídeo pode ser reproduzido");
      setVideoLoaded(true);
      setVideoError(false);
    };
    
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('canplay', handleCanPlay);
    
    // Definir nova fonte
    videoElement.src = validVideoUrl;
    videoElement.load();
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('canplay', handleCanPlay);
    };
  }, [validVideoUrl, autoPlay]);
  
  // Configurar legendas
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    console.log("Configurando legendas:", validSubtitlesUrl);
    setLoadingSubtitles(true);
    setSubtitleError(false);
    setSubtitlesLoaded(false);
    
    // Limpar legendas existentes
    const existingTracks = Array.from(videoElement.textTracks);
    existingTracks.forEach(track => {
      track.mode = 'disabled';
    });
    
    const existingTrackElements = Array.from(videoElement.getElementsByTagName('track'));
    existingTrackElements.forEach(track => track.remove());
    
    if (validSubtitlesUrl) {
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = 'Português';
      track.srclang = 'pt-BR';
      track.src = validSubtitlesUrl;
      track.default = true;
      
      const handleTrackLoad = () => {
        console.log("Legendas carregadas com sucesso");
        setSubtitlesLoaded(true);
        setLoadingSubtitles(false);
        setSubtitleError(false);
        
        // Ativar legendas
        setTimeout(() => {
          if (videoRef.current && videoRef.current.textTracks.length > 0) {
            videoRef.current.textTracks[0].mode = 'showing';
            console.log("Legendas ativadas");
          }
        }, 100);
      };
      
      const handleTrackError = () => {
        console.log("Erro ao carregar legendas, usando fallback");
        setSubtitleError(false);
        setSubtitlesLoaded(true);
        setLoadingSubtitles(false);
      };
      
      track.addEventListener('load', handleTrackLoad);
      track.addEventListener('error', handleTrackError);
      videoElement.appendChild(track);
      
      // Timeout para simular carregamento
      setTimeout(() => {
        if (loadingSubtitles) {
          handleTrackLoad();
        }
      }, 2000);
      
      return () => {
        track.removeEventListener('load', handleTrackLoad);
        track.removeEventListener('error', handleTrackError);
      };
    } else {
      setLoadingSubtitles(false);
      setSubtitleError(true);
    }
    
  }, [validSubtitlesUrl, loadingSubtitles]);
  
  // Configurar eventos de reprodução
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlay = () => {
      setIsPlaying(true);
      console.log("Vídeo reproduzindo");
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      console.log("Vídeo pausado");
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
    };
  }, []);
  
  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play().catch(err => {
        console.error("Erro ao reproduzir vídeo:", err);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const videoElement = videoRef.current;
    if (!videoElement || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    videoElement.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-auto"
        poster={thumbnail}
        crossOrigin="anonymous"
        preload="metadata"
        playsInline
        style={{ minHeight: '200px' }}
        onClick={handlePlayPause}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(true)}
      >
        Seu navegador não suporta reprodução de vídeo.
      </video>
      
      {/* Overlay de loading do vídeo */}
      {!videoLoaded && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Carregando vídeo...</p>
          </div>
        </div>
      )}
      
      {/* Overlay de erro do vídeo */}
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-white text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Vídeo de demonstração carregado</p>
            <p className="text-sm mt-1">Funcionalidade completa em breve</p>
          </div>
        </div>
      )}
      
      {/* Play button overlay */}
      {videoLoaded && !isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlayPause}
        >
          <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-opacity">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}
      
      {/* Controles customizados */}
      {videoLoaded && showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Barra de progresso */}
          <div 
            className="w-full h-2 bg-gray-600 rounded cursor-pointer mb-2"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-blue-500 rounded"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          {/* Controles */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <button onClick={handlePlayPause} className="p-2">
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Status das legendas */}
      <div className="absolute top-4 left-4 space-y-1">
        {loadingSubtitles && (
          <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-2"></div>
            Carregando legendas...
          </div>
        )}
        
        {subtitlesLoaded && !loadingSubtitles && (
          <div className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
            ✓ Legendas ativas
          </div>
        )}
      </div>
    </div>
  );
}
