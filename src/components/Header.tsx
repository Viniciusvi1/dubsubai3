import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">DubSubAI</Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Início</Link>
          <Link to="/funcionalidades" className="hover:underline">Funcionalidades</Link>
          <Link to="/sobre" className="hover:underline">Sobre nós</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Button 
                variant="ghost" 
                onClick={logout} 
                className="text-white hover:bg-blue-700"
              >
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
