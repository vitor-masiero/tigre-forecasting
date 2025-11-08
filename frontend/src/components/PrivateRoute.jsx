import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

/**
 * Componente que protege rotas privadas
 * Se não autenticado -> mostra Login
 * Se autenticado mas sem permissão -> mostra tela de acesso negado
 */
export default function PrivateRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user, hasRole, hasPermission } = useAuth();

  // Se não está autenticado, mostra login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Se requer role específico e usuário não tem
  if (requiredRole && !hasRole(requiredRole)) {
    // Se é um array de roles permitidos
    if (Array.isArray(requiredRole)) {
      const hasAnyRole = requiredRole.some(role => hasRole(role));
      if (!hasAnyRole) {
        return <AccessDenied userRole={user.role} requiredRoles={requiredRole} />;
      }
    } else {
      // Se é uma string (role única)
      return <AccessDenied userRole={user.role} requiredRoles={[requiredRole]} />;
    }
  }

  // Se passou nas validações, renderiza o componente
  return children;
}

/**
 * Tela de Acesso Negado
 */
function AccessDenied({ userRole, requiredRoles }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Ícone de Bloqueio */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Mensagem */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página.
          </p>

          {/* Informações de Permissão */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-2">Informações de Acesso:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-semibold">Seu perfil:</span> {getRoleLabel(userRole)}</p>
                  <p><span className="font-semibold">Perfis permitidos:</span> {requiredRoles.map(getRoleLabel).join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition"
            >
              Voltar
            </button>
            <button
              onClick={logout}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              Trocar Conta
            </button>
          </div>
        </div>

        {/* Mensagem de Ajuda */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Precisa de acesso? Entre em contato com o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper para traduzir role para português
 */
function getRoleLabel(role) {
  const labels = {
    'gestao': 'Gestão',
    'analista': 'Analista',
    'comercial': 'Comercial'
  };
  return labels[role] || role;
}