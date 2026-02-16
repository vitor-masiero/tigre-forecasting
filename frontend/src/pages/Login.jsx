import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Lock, Mail, ChevronRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.senha) {
      setError('Campos obrigatórios não preenchidos');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.senha);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Lado Esquerdo - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 p-16 flex-col justify-between overflow-hidden">
        {/* Imagem de Fundo com Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: "url('/industrial-quality-control.webp')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-brand-600/20 to-slate-950/90" />

        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-brand-600 rounded-2xl shadow-lg shadow-brand-600/30">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">Tigre Vision Pro
            </span>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Previsões de demanda com <span className="text-brand-400">Precisão Cirúrgica.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Utilizamos modelos avançados de Machine Learning para transformar seus dados históricos em vantagem competitiva real.
            </p>
          </div>
        </div>

      </div>

      {/* Lado Direito - Form de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="p-4 bg-brand-600 rounded-2xl shadow-lg shadow-brand-600/20">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">Bem-vindo de volta</h2>
            <p className="text-slate-500 font-medium">Acesse sua conta para gerenciar as previsões.</p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake-in duration-300">
              <ShieldCheck className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-800 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-600 text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-300"
                  placeholder="exemplo@tigre.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Senha de Acesso</label>
                
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-600 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <button type="button" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">Esqueceu a senha?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-brand-900/20 active:scale-[0.98] disabled:opacity-70 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Ambiente de Demonstração</p>
              <div className="flex justify-center gap-4">
                <div className="text-xs font-bold text-slate-600">
                  <span className="text-slate-400 mr-1 font-medium">User:</span> admin@tigre.com
                </div>
                <div className="text-xs font-bold text-slate-600">
                  <span className="text-slate-400 mr-1 font-medium">Pass:</span> senha123
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="absolute bottom-8 text-slate-400 text-xs font-medium">
          © 2025 Tigre Vision Pro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
