import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { assemblyAiService } from "@/services/assemblyAiService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef, useState, useEffect } from "react";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  status: 'processing' | 'ready' | 'error';
  duration: string;
  date: string;
  language: string;
  targetLanguage?: string;
  type: 'subtitle' | 'dubbing' | 'translation';
  videoUrl?: string;
  subtitlesUrl?: string;
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  status,
  duration,
  date,
  language,
  targetLanguage,
  type,
  videoUrl,
  subtitlesUrl
}: VideoCardProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitlesLoaded, setSubtitlesLoaded] = useState(false);
  const [loadingSubtitles, setLoadingSubtitles] = useState(false);
  
  // Verificar quando as legendas são carregadas
  useEffect(() => {
    if (!videoRef.current || !subtitlesUrl) return;
    
    const loadSubtitles = () => {
      if (!videoRef.current) return;
      setLoadingSubtitles(true);
      
      // Garantir que o elemento de vídeo tenha sido carregado
      if (videoRef.current.readyState < 1) {
        videoRef.current.addEventListener('loadedmetadata', setupTextTracks, { once: true });
      } else {
        setupTextTracks();
      }
    };
    
    const setupTextTracks = () => {
      if (!videoRef.current) return;
      
      // Remover todas as faixas existentes para evitar duplicações
      while (videoRef.current.textTracks.length > 0) {
        const track = videoRef.current.textTracks[0];
        if (track && 'remove' in track) {
          // @ts-ignore - Alguns navegadores suportam remove()
          track.remove();
        }
      }
      
      // Certificar de que todas as faixas existentes estão desativadas
      for (let i = 0; i < videoRef.current.textTracks.length; i++) {
        videoRef.current.textTracks[i].mode = 'disabled';
      }
      
      // Criar e adicionar uma nova faixa de texto
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = 'Português';
      track.srcLang = 'pt-BR';
      track.src = subtitlesUrl + '?v=' + new Date().getTime(); // Evitar cache
      track.default = true;
      
      // Adicionar evento de carregamento à faixa
      track.addEventListener('load', () => {
        console.log("Faixa de legendas carregada com sucesso");
        setSubtitlesLoaded(true);
        setLoadingSubtitles(false);
      });
      
      // Adicionar evento de erro à faixa
      track.addEventListener('error', (e) => {
        console.error("Erro ao carregar as legendas:", e);
        setLoadingSubtitles(false);
      });
      
      videoRef.current.appendChild(track);
      
      // Ativar a faixa após adicioná-la
      setTimeout(() => {
        if (videoRef.current && videoRef.current.textTracks.length > 0) {
          videoRef.current.textTracks[0].mode = 'showing';
        }
      }, 100);
    };
    
    loadSubtitles();
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', setupTextTracks);
      }
    };
  }, [videoUrl, subtitlesUrl]);
  
  // Verificar se as legendas estão sendo exibidas através dos eventos cuechange
  useEffect(() => {
    if (!videoRef.current || !isPlaying) return;
    
    const handleCueChange = () => {
      if (videoRef.current && videoRef.current.textTracks && videoRef.current.textTracks.length > 0) {
        const track = videoRef.current.textTracks[0];
        if (track.activeCues && track.activeCues.length > 0) {
          setSubtitlesLoaded(true);
          setLoadingSubtitles(false);
        }
      }
    };
    
    if (videoRef.current.textTracks && videoRef.current.textTracks.length > 0) {
      const track = videoRef.current.textTracks[0];
      track.addEventListener('cuechange', handleCueChange);
      
      return () => {
        track.removeEventListener('cuechange', handleCueChange);
      };
    }
  }, [isPlaying]);
  
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Em processamento';
      case 'ready':
        return 'Pronto';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const getTypeText = () => {
    switch (type) {
      case 'subtitle':
        return 'Legendagem';
      case 'dubbing':
        return 'Dublagem';
      case 'translation':
        return 'Tradução';
      default:
        return 'Desconhecido';
    }
  };

  // Usar um vídeo de exemplo garantido se não tiver thumbnail
  const defaultThumbnail = "https://via.placeholder.com/320x180.png?text=Vídeo+sem+thumbnail";

  // Função para download de vídeo com feedback visual
  const handleDownload = async (type: string) => {
    toast({
      title: `Download iniciado`,
      description: `Preparando ${type} para download...`,
    });
    
    try {
      let blob: Blob;
      let filename: string;
      
      switch (type) {
        case 'vídeo':
          blob = await assemblyAiService.downloadVideo(id);
          filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
          break;
        case 'legenda':
          blob = await assemblyAiService.downloadSubtitles(id);
          filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.srt`;
          break;
        case 'áudio':
          blob = await assemblyAiService.downloadAudio(id);
          filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
          break;
        default:
          throw new Error(`Tipo de download não suportado: ${type}`);
      }
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Limpar recursos
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download concluído!",
        description: `O arquivo ${filename} foi baixado com sucesso.`,
      });
    } catch (error) {
      console.error(`Erro ao baixar ${type}:`, error);
      toast({
        title: "Erro no download",
        description: `Não foi possível baixar o ${type}. Tente novamente.`,
        variant: "destructive",
      });
    }
  };

  // Função para controlar o preview do vídeo
  const handleTogglePreview = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Se iniciar a reprodução, verificar se as legendas estão carregadas
        if (!subtitlesLoaded) {
          setLoadingSubtitles(true);
        }
        
        videoRef.current.play().catch(err => {
          console.error("Erro ao reproduzir vídeo:", err);
          toast({
            title: "Erro ao reproduzir",
            description: "Não foi possível iniciar a reprodução do vídeo.",
            variant: "destructive"
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-full sm:w-40 h-24 rounded-md overflow-hidden bg-gray-100">
            {videoUrl && status === 'ready' ? (
              <video 
                ref={videoRef}
                src={videoUrl}
                poster={thumbnail || defaultThumbnail}
                className="w-full h-full object-cover"
                preload="metadata"
                onClick={handleTogglePreview}
                style={{ cursor: 'pointer' }}
                crossOrigin="anonymous"
              />
            ) : (
              <img 
                src={thumbnail || defaultThumbnail} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
              {duration}
            </span>
            
            {/* Play/Pause overlay */}
            {videoUrl && status === 'ready' && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity"
                onClick={handleTogglePreview}
              >
                <div className="text-white bg-black bg-opacity-50 rounded-full p-1">
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </div>
              </div>
            )}
            
            {/* Subtitle status indicator */}
            {videoUrl && status === 'ready' && isPlaying && loadingSubtitles && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                Carregando legendas...
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
              <div className="flex items-center flex-wrap gap-2 mt-1">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
                <span className="text-xs text-gray-500">
                  {date}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {getTypeText()}
                </span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Idioma original: <span className="font-medium">{language}</span></span>
                {targetLanguage && (
                  <>
                    <span className="mx-2">→</span>
                    <span>Idioma alvo: <span className="font-medium">{targetLanguage}</span></span>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-x-2 flex-shrink-0">
              {status === 'ready' ? (
                <>
                  <Link to={`/result/${id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                    >
                      Ver
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload('vídeo')}>Baixar vídeo</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('legenda')}>Baixar legenda (.SRT)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('áudio')}>Baixar áudio</DropdownMenuItem>
                      <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : status === 'processing' ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled
                >
                  Processando...
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Tentar novamente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
