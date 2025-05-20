import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be connected to auth state in a full implementation

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="font-bold text-xl bg-brand-blue text-white px-2 py-1 rounded">
            DS
          </div>
          <span className="text-xl font-bold text-gray-800">DubSubAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/features" className="text-gray-600 hover:text-brand-blue transition-colors">
            Funcionalidades
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-brand-blue transition-colors">
            Preços
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-brand-blue transition-colors">
            Sobre nós
          </Link>
          
          {!isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-brand-blue text-white hover:bg-brand-blue-dark">
                  Registrar
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/dashboard">
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => setIsLoggedIn(false)} 
                className="text-gray-600"
              >
                Sair
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {!isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-3 px-4 absolute top-16 left-0 right-0 z-50 border-b border-gray-200 shadow-md animate-fade-in">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/features" 
              className="px-2 py-1 text-gray-600 hover:text-brand-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link 
              to="/pricing" 
              className="px-2 py-1 text-gray-600 hover:text-brand-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </Link>
            <Link 
              to="/about" 
              className="px-2 py-1 text-gray-600 hover:text-brand-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre nós
            </Link>
            <hr className="my-2" />
            {!isLoggedIn ? (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-brand-blue text-white hover:bg-brand-blue-dark">
                    Registrar
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsMenuOpen(false);
                  }} 
                  className="w-full text-gray-600"
                >
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
