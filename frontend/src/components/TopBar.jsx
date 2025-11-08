import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function TopBar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'gestao': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'analista': 'bg-purple-100 text-purple-800 border-purple-200',
      'comercial': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'gestao': 'Gestão',
      'analista': 'Analista',
      'comercial': 'Comercial'
    };
    return labels[role] || role;
  };

  // Pega iniciais do nome
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Lado Esquerdo - Pode adicionar breadcrumbs ou título aqui */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Bem-vindo de volta! 👋
          </div>
        </div>

        {/* Lado Direito - User Info */}
        <div className="flex items-center gap-4">
          {/* Badge de Role */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user?.role)}`}>
            {getRoleLabel(user?.role)}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
            >
              {/* Avatar com Iniciais */}
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(user?.nome)}
              </div>

              {/* Nome e Email */}
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.nome || 'Usuário'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email}
                </div>
              </div>

              {/* Ícone de Dropdown */}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info no Dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-semibold text-gray-900 mb-1">
                    {user?.nome}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {user?.email}
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role)}`}>
                    <User className="w-3 h-3" />
                    {getRoleLabel(user?.role)}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      // Navegar para perfil (implementar depois)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Meu Perfil
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      // Navegar para configurações (implementar depois)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Configurações
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}