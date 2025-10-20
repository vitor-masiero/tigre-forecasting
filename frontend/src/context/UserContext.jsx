import React, { createContext, useState, useCallback } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([
    {
      id: '001',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com',
      cpf: '123.456.789-00',
      cargo: 'Gerente Comercial',
      tipo: 'comercial',
      contato: '(11) 98765-4321',
      dataCriacao: '2024-01-15'
    },
    {
      id: '002',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      cpf: '987.654.321-00',
      cargo: 'Coordenador de Marketing',
      tipo: 'marketing',
      contato: '(11) 99876-5432',
      dataCriacao: '2024-02-10'
    },
    {
      id: '003',
      nome: 'Pedro Costa',
      email: 'pedro.costa@empresa.com',
      cpf: '456.789.123-00',
      cargo: 'Especialista em Dados',
      tipo: 'analise',
      contato: '(11) 97654-3210',
      dataCriacao: '2024-03-05'
    }
  ]);

  const addUser = useCallback((userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUser = useCallback((userId, userData) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
  }, []);

  const deleteUser = useCallback((userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}
