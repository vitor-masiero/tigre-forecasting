import { useState, useEffect } from 'react';
import api from '../utils/Api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Busca todos os usuários da API
   */
const fetchUsers = async (includeInactive = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/users/', {
        params: { include_inactive: includeInactive }
      });

      console.log('✅ Usuários carregados:', response.data);
      
      // Normaliza todos os usuários para garantir que 'tipo' existe
      const normalizedUsers = (response.data.usuarios || []).map(user => ({
        ...user,
        tipo: user.tipo || user.role
      }));
      
      setUsers(normalizedUsers);
      
    } catch (err) {
      console.error('❌ Erro ao carregar usuários:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar usuários');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cria novo usuário
   */
const addUser = async (userData) => {
    try {
      setLoading(true);

      // Payload para API
      const payload = {
        nome: userData.nome,
        email: userData.email,
        role: userData.tipo, // Frontend usa 'tipo', API usa 'role'
        senha: userData.senha,
        ativo: userData.ativo ?? true
      };

      console.log('📤 Criando usuário:', payload);

      const response = await api.post('/users/', payload);

      console.log('✅ Usuário criado:', response.data);

      // Normaliza resposta para garantir que 'tipo' existe
      const normalizedUser = {
        ...response.data,
        tipo: response.data.tipo || response.data.role
      };

      // Atualiza lista local
      setUsers(prev => [normalizedUser, ...prev]);

      return { 
        success: true, 
        user: normalizedUser
      };

    } catch (err) {
      console.error('❌ Erro ao criar usuário:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao criar usuário';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza usuário existente
   */
const updateUser = async (userId, userData) => {
    try {
      setLoading(true);

      // Payload para API (apenas campos que mudaram)
      const payload = {};
      
      if (userData.nome !== undefined) payload.nome = userData.nome;
      if (userData.email !== undefined) payload.email = userData.email;
      if (userData.tipo !== undefined) payload.role = userData.tipo;
      if (userData.ativo !== undefined) payload.ativo = userData.ativo;

      console.log('📤 Atualizando usuário:', userId, payload);

      const response = await api.put(`/users/${userId}`, payload);

      console.log('✅ Usuário atualizado:', response.data);

      // Normaliza resposta para garantir que 'tipo' existe
      const normalizedUser = {
        ...response.data,
        tipo: response.data.tipo || response.data.role
      };

      // Atualiza lista local
      setUsers(prev => prev.map(user => 
        user.id_usuario === userId ? normalizedUser : user
      ));

      return { 
        success: true, 
        user: normalizedUser
      };

    } catch (err) {
      console.error('❌ Erro ao atualizar usuário:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao atualizar usuário';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Desativa usuário (soft delete)
   */
  const deleteUser = async (userId) => {
    try {
      setLoading(true);

      console.log('📤 Desativando usuário:', userId);

      const response = await api.delete(`/users/${userId}`);

      console.log('✅ Usuário desativado:', response.data);

      // Atualiza lista local - marca como inativo
      setUsers(prev => prev.map(user => 
        user.id_usuario === userId 
          ? { ...user, ativo: false } 
          : user
      ));

      return { 
        success: true, 
        message: response.data.message 
      };

    } catch (err) {
      console.error('❌ Erro ao desativar usuário:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao desativar usuário';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reativa usuário
   */
  const reactivateUser = async (userId) => {
    try {
      setLoading(true);

      console.log('📤 Reativando usuário:', userId);

      const response = await api.put(`/users/${userId}`, { ativo: true });

      console.log('✅ Usuário reativado:', response.data);

      // Atualiza lista local
      setUsers(prev => prev.map(user => 
        user.id_usuario === userId ? response.data : user
      ));

      return { 
        success: true, 
        user: response.data 
      };

    } catch (err) {
      console.error('❌ Erro ao reativar usuário:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao reativar usuário';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    reactivateUser,
    refreshUsers: fetchUsers
  };
}