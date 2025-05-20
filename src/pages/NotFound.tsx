import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-brand-blue">404</h1>
          <p className="text-2xl font-semibold mt-4 mb-6">Página não encontrada</p>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
          </p>
          <Link to="/">
            <Button className="bg-brand-blue hover:bg-brand-blue-dark text-white">
              Voltar para a página inicial
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
