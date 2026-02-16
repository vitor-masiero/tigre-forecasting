import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import GerarPrevisao from './pages/GerarPrevisao';
import Historico from './pages/Historico';
import Automacoes from './pages/Automacoes';
import ImportarDados from './pages/ImportarDados';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        );
      case 'gerar-previsao':
        return (
          <PrivateRoute requiredRole={['analista', 'comercial', 'gestao']}>
            <GerarPrevisao />
          </PrivateRoute>
        );
      case 'historico':
        return (
          <PrivateRoute requiredRole={['analista', 'comercial', 'gestao']}>
            <Historico />
          </PrivateRoute>
        );
      case 'automacoes':
        return (
          <PrivateRoute requiredRole={['analista', 'gestao']}>
            <Automacoes />
          </PrivateRoute>
        );
      case 'importar-dados':
        return (
          <PrivateRoute requiredRole={['analista', 'gestao']}>
            <ImportarDados />
          </PrivateRoute>
        );
      case 'configuracoes':
        return (
          <PrivateRoute requiredRole="gestao">
            <Configuracoes />
          </PrivateRoute>
        );
      default:
        return (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        );
    }
  };

  return (
    <AuthProvider>
      <UserProvider>
        <AppContent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          renderPage={renderPage}
        />
      </UserProvider>
    </AuthProvider>
  );
}


/**
 * Conteúdo da aplicação (separado para ter acesso ao AuthContext)
 */
function AppContent({ currentPage, setCurrentPage, renderPage }) {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto carrega o estado de autenticação, mostra nada ou um spinner
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, mostra apenas a tela de login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Se estiver autenticado, mostra o layout completo
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="print:hidden">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="print:hidden">
          <TopBar setCurrentPage={setCurrentPage} />
        </div>
        <div className="flex-1 overflow-y-auto print:overflow-visible">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}