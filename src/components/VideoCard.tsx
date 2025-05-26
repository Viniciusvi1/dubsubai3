import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { assemblyAiService } from "@/services/assemblyAiService";
import { subtitleUtils } from "@/integrations/supabase/client";
import VideoPlayer from "@/components/VideoPlayer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // URLs válidas para demonstração
  const validVideoUrl = videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const validSubtitlesUrl = subtitlesUrl || "/sample-subtitles-pt.vtt";
  const validThumbnail = thumbnail || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";
  
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
    setShowPreview(!showPreview);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="dashboard-card">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-full sm:w-40 h-24 rounded-md overflow-hidden bg-gray-100">
            {status === 'ready' ? (
              showPreview ? (
                <div className="w-full h-full">
                  <VideoPlayer
                    videoUrl={validVideoUrl}
                    subtitlesUrl={validSubtitlesUrl}
                    thumbnail={validThumbnail}
                    autoPlay={true}
                  />
                </div>
              ) : (
                <img 
                  src={validThumbnail} 
                  alt={title} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handleTogglePreview}
                />
              )
            ) : (
              <img 
                src={validThumbnail} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
              {duration}
            </span>
            
            {/* Play overlay */}
            {status === 'ready' && !showPreview && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity cursor-pointer"
                onClick={handleTogglePreview}
              >
                <div className="text-white bg-black bg-opacity-50 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
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
