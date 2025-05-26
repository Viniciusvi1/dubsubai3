import { useState, ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { assemblyAiService } from "@/services/assemblyAiService";
import { elevenLabsService } from "@/services/elevenLabsService";

type VoiceStyle = "formal" | "casual" | "young" | "senior";

export default function Upload() {
  const [uploadType, setUploadType] = useState("file");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("pt-BR");
  const [serviceType, setServiceType] = useState("subtitle");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>("formal");
  const [isUploading, setIsUploading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Array<{id: string, name: string, gender: string}>>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const { toast } = useToast();
  const { isLoggedIn, checkAuth } = useAuth();
  const navigate = useNavigate();

  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
    }
  }, [checkAuth, navigate, toast]);

  // Buscar vozes disponíveis quando o idioma de destino mudar
  useEffect(() => {
    if (serviceType === "dubbing" && targetLanguage) {
      const fetchVoices = async () => {
        try {
          const voices = await elevenLabsService.getAvailableVoices(targetLanguage);
          setAvailableVoices(voices);
          if (voices.length > 0) {
            setSelectedVoice(voices[0].id);
          }
        } catch (error) {
          console.error("Erro ao buscar vozes:", error);
          toast({
            title: "Erro ao carregar vozes",
            description: "Não foi possível carregar as vozes disponíveis.",
            variant: "destructive",
          });
        }
      };
      
      fetchVoices();
    }
  }, [targetLanguage, serviceType, toast]);

  // Verificar se o usuário está logado
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
    }
  }, [isLoggedIn, toast]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Formato de arquivo inválido",
          description: "Por favor, envie um arquivo de vídeo MP4, MOV ou AVI.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (selectedFile.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é de 500MB.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const validateYoutubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return regex.test(url);
  };

  const handleYoutubeUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
  };

  // Fix for the TypeScript error - Create a handler function that properly types the value
  const handleVoiceStyleChange = (value: string) => {
    // Validate that the value is one of the allowed VoiceStyle types
    if (value === "formal" || value === "casual" || value === "young" || value === "senior") {
      setVoiceStyle(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar novamente se o usuário está logado antes de processar
    if (!checkAuth()) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para enviar vídeos.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      return;
    }
    
    // Validate form based on the upload type
    if (uploadType === "file" && !file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo de vídeo para processar.",
        variant: "destructive",
      });
      return;
    }
    
    if (uploadType === "youtube" && !validateYoutubeUrl(youtubeUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do YouTube.",
        variant: "destructive",
      });
      return;
    }
    
    if (serviceType !== "subtitle" && !targetLanguage) {
      toast({
        title: "Idioma não selecionado",
        description: "Por favor, selecione um idioma de destino.",
        variant: "destructive",
      });
      return;
    }
    
    if (serviceType === "dubbing" && !selectedVoice) {
      toast({
        title: "Voz não selecionada",
        description: "Por favor, selecione uma voz para a dublagem.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Processar com base no tipo de serviço
      if (serviceType === "subtitle" || serviceType === "translation") {
        // Para legendagem ou tradução, usar o serviço AssemblyAI
        const options = {
          language: detectedLanguage,
          speakerDetection: true,
          punctuation: true,
          formatting: true,
        };
        
        const videoSource = uploadType === "file" ? file : youtubeUrl;
        const result = await assemblyAiService.submitTranscription(videoSource, options);
        
        toast({
          title: "Vídeo enviado com sucesso!",
          description: `Seu vídeo está em processamento e estará disponível em breve. ID: ${result.transcriptionId}`,
        });
      } else if (serviceType === "dubbing") {
        // Fix for the TypeScript error - ensure voiceStyle is one of the accepted values
        const dubbingStyle = (voiceStyle || "formal") as "formal" | "casual" | "young" | "senior";
        
        // Para dublagem, usar o serviço ElevenLabs
        const options = {
          voiceId: selectedVoice,
          language: targetLanguage,
          style: dubbingStyle,
        };
        
        const videoSource = uploadType === "file" ? file : youtubeUrl;
        const result = await elevenLabsService.submitDubbing(videoSource, options);
        
        toast({
          title: "Vídeo enviado para dublagem!",
          description: `Seu vídeo está em processamento e estará disponível em breve. ID: ${result.dubbingId}`,
        });
      }
      
      // Usar navigate em vez de window.location para evitar perda de estado
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Erro ao processar o vídeo:", error);
      toast({
        title: "Erro ao processar o vídeo",
        description: "Ocorreu um erro ao processar seu vídeo. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Acesso restrito</h1>
            <p className="mb-6">Você precisa estar logado para acessar esta página.</p>
            <Link to="/login">
              <Button>Fazer login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Enviar novo vídeo</h1>
            <p className="text-gray-600 mt-1">
              Faça upload de um arquivo de vídeo ou use um link do YouTube
            </p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Upload tabs */}
              <div className="p-6 border-b border-gray-200">
                <Tabs 
                  defaultValue="file" 
                  value={uploadType} 
                  onValueChange={setUploadType}
                  className="w-full"
                >
                  <TabsList className="mb-6">
                    <TabsTrigger value="file" className="flex-1">Enviar Arquivo</TabsTrigger>
                    <TabsTrigger value="youtube" className="flex-1">Link do YouTube</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file">
                    <div 
                      className="video-upload-box border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      {!file ? (
                        <>
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <h3 className="text-lg font-medium mb-2">
                            Arraste e solte seu vídeo aqui
                          </h3>
                          <p className="text-gray-500 text-sm mb-4">
                            ou clique para selecionar um arquivo
                          </p>
                          <p className="text-gray-400 text-sm">
                            MP4, MOV ou AVI (máx. 500MB)
                          </p>
                        </>
                      ) : (
                        <>
                          <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <h3 className="text-lg font-medium mb-2">
                            Arquivo selecionado
                          </h3>
                          <p className="text-gray-700 mb-2">{file.name}</p>
                          <p className="text-gray-500 text-sm">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="mt-4 text-brand-blue hover:text-brand-blue-dark"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                          >
                            Alterar arquivo
                          </Button>
                        </>
                      )}
                      <input 
                        id="video-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".mp4,.mov,.avi" 
                        onChange={handleFileChange} 
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="youtube">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="youtube-url">URL do YouTube</Label>
                        <Input
                          id="youtube-url"
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={youtubeUrl}
                          onChange={handleYoutubeUrlChange}
                          className="mt-1"
                        />
                      </div>
                      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
                        <p>
                          <strong>Nota:</strong> Certifique-se de que o vídeo do YouTube não tenha restrições de privacidade.
                          Apenas vídeos públicos ou não listados podem ser processados.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Service options */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Opções de processamento</h3>
                
                <div className="mb-6">
                  <Label className="mb-2 block">Idioma detectado</Label>
                  <Select 
                    value={detectedLanguage} 
                    onValueChange={setDetectedLanguage}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o idioma do vídeo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">Inglês (EUA)</SelectItem>
                      <SelectItem value="es-ES">Espanhol (Espanha)</SelectItem>
                      <SelectItem value="fr-FR">Francês (França)</SelectItem>
                      <SelectItem value="de-DE">Alemão (Alemanha)</SelectItem>
                      <SelectItem value="it-IT">Italiano (Itália)</SelectItem>
                      <SelectItem value="ja-JP">Japonês (Japão)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <Label className="mb-2 block">Tipo de serviço</Label>
                  <RadioGroup 
                    value={serviceType}
                    onValueChange={setServiceType}
                    className="grid gap-4"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="subtitle" id="subtitle" />
                      <Label htmlFor="subtitle" className="font-normal cursor-pointer">
                        <div className="font-medium">Apenas legenda</div>
                        <div className="text-sm text-gray-500">Transcrição e legendagem no idioma original</div>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="translation" id="translation" />
                      <Label htmlFor="translation" className="font-normal cursor-pointer">
                        <div className="font-medium">Legenda + Tradução</div>
                        <div className="text-sm text-gray-500">Transcrição e tradução para outro idioma</div>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="dubbing" id="dubbing" />
                      <Label htmlFor="dubbing" className="font-normal cursor-pointer">
                        <div className="font-medium">Dublagem</div>
                        <div className="text-sm text-gray-500">Gerar voz sintetizada em outro idioma</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {(serviceType === "translation" || serviceType === "dubbing") && (
                  <div className="mb-6">
                    <Label className="mb-2 block">Idioma de destino</Label>
                    <Select 
                      value={targetLanguage} 
                      onValueChange={setTargetLanguage}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o idioma de destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">Inglês (EUA)</SelectItem>
                        <SelectItem value="es-ES">Espanhol (Espanha)</SelectItem>
                        <SelectItem value="fr-FR">Francês (França)</SelectItem>
                        <SelectItem value="de-DE">Alemão (Alemanha)</SelectItem>
                        <SelectItem value="it-IT">Italiano (Itália)</SelectItem>
                        <SelectItem value="ja-JP">Japonês (Japão)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {serviceType === "dubbing" && (
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Voz</Label>
                      {availableVoices.length > 0 ? (
                        <Select 
                          value={selectedVoice} 
                          onValueChange={setSelectedVoice}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma voz" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableVoices.map((voice) => (
                              <SelectItem key={voice.id} value={voice.id}>
                                {voice.name} ({voice.gender === 'male' ? 'Masculina' : 'Feminina'})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-500 text-sm">Selecione um idioma de destino para ver as vozes disponíveis</p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-2 block">Estilo de voz</Label>
                      <Select 
                        value={voiceStyle} 
                        onValueChange={handleVoiceStyleChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um estilo de voz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formal">Formal (Profissional)</SelectItem>
                          <SelectItem value="casual">Casual (Conversação)</SelectItem>
                          <SelectItem value="young">Jovem e Energético</SelectItem>
                          <SelectItem value="senior">Maduro e Confiante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="p-6 flex justify-end gap-3">
                <Link to="/dashboard">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isUploading}
                >
                  {isUploading ? "Enviando..." : "Processar vídeo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
