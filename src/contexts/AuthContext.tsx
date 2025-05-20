import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  checkAuth: () => false,
});

// Lista de rotas que requerem autenticação
const protectedRoutes = ['/dashboard', '/upload', '/result'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const checkAuthentication = () => {
      const authStatus = localStorage.getItem("isLoggedIn");
      if (authStatus === "true") {
        setIsLoggedIn(true);
      } else {
        // Se não estiver logado e tentar acessar uma rota protegida
        if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
          navigate('/login', { replace: true });
        }
      }
    };
    
    checkAuthentication();
  }, [location.pathname, navigate]);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate('/login', { replace: true });
  };

  // Função para verificar autenticação
  const checkAuth = () => {
    const authStatus = localStorage.getItem("isLoggedIn");
    return authStatus === "true";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
