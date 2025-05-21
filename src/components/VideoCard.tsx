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
  videoUrl
}: VideoCardProps) {
  const { toast } = useToast();
  
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

  // Função para abrir uma prévia do vídeo
  const handlePreview = () => {
    if (videoUrl) {
      // Se tiver URL do vídeo, abre em uma nova aba
      window.open(videoUrl, '_blank');
    } else {
      toast({
        title: "Vídeo não disponível",
        description: "O vídeo ainda não está disponível para visualização.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-full sm:w-40 h-24 rounded-md overflow-hidden bg-gray-100">
            {videoUrl && status === 'ready' ? (
              <video 
                src={videoUrl}
                poster={thumbnail || defaultThumbnail}
                className="w-full h-full object-cover"
                preload="metadata"
                onClick={handlePreview}
                style={{ cursor: 'pointer' }}
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
