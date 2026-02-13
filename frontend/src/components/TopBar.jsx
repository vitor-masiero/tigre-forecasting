import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, ChevronDown, Bell, Search } from 'lucide-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

export default function TopBar({ setCurrentPage }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

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
    logout();
    setShowModal(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Search Bar - Minimal */}
        <div className="hidden md:flex items-center gap-3 bg-slate-100/50 border border-slate-200/60 rounded-2xl px-4 py-2 w-96 group focus-within:bg-white focus-within:shadow-sm focus-within:border-brand-200 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por SKUs, previsões ou datas..." 
            className="bg-transparent border-none text-sm text-slate-600 focus:outline-none w-full placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <div className="h-8 w-[1px] bg-slate-200/60" />

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 rounded-2xl px-2 py-1 transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                {getInitials(user?.nome)}
              </div>

              <div className="text-left hidden lg:block">
                <div className="text-sm font-bold text-slate-900 tracking-tight">
                  {user?.nome || 'Usuário'}
                </div>
                <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
                  {user?.role || 'Membro'}
                </div>
              </div>

              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu - Refined */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-[24px] shadow-2xl border border-slate-200/60 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50">
                  <div className="font-bold text-slate-900 mb-0.5">{user?.nome}</div>
                  <div className="text-xs font-medium text-slate-500 mb-3">{user?.email}</div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 shadow-sm">
                    <User className="w-3 h-3 text-brand-500" />
                    Perfil: {user?.role}
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setCurrentPage("configuracoes");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-all"
                  >
                    <Settings className="w-4 h-4 opacity-70" />
                    Configurações de Conta
                  </button>
                  
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4 opacity-70" />
                    Encerrar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="custom-modal">
        <Modal.Header closeButton className="border-none px-8 pt-8">
          <Modal.Title className="font-bold text-slate-900">Confirmar Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-8 text-slate-500 font-medium">
          Tem certeza que deseja sair do sistema? Suas alterações salvas não serão perdidas.
        </Modal.Body>
        <Modal.Footer className="border-none px-8 pb-8 gap-3">
          <Button variant="light" className="rounded-xl px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-100" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button className="bg-brand-600 hover:bg-brand-700 border-none rounded-xl px-8 py-2.5 font-bold text-white shadow-lg shadow-brand-900/20" onClick={handleLogout}>
            Sair Agora
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}