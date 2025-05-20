import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteVideoDialogProps {
  videoId: string;
  videoTitle: string;
  onDeleteSuccess: () => void;
}

export default function DeleteVideoDialog({ videoId, videoTitle, onDeleteSuccess }: DeleteVideoDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Simulação de API call para deletar o vídeo
      // Em uma implementação real, aqui você faria uma chamada à sua API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído com sucesso.",
      });
      
      setIsOpen(false);
      onDeleteSuccess();
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o vídeo. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir vídeo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o vídeo "{videoTitle}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Sim, excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
