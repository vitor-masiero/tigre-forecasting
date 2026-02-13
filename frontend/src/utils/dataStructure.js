// ============================================
// ARQUIVO: src/utils/dataStructure.js (ATUALIZADO)
// ============================================

export const GRANULARITY_LEVELS = {
  TODAS: {
    id: 'todas',
    label: 'Todas',
    description: 'Previsão de todas as linhas e processos',
    icon: 'all'
  },
  COMBINACAO: {
    id: 'combinacao',
    label: 'Combinação',
    description: 'Selecione linhas, processos e classificações',
    icon: 'combo'
  },
  POR_SKU: {
    id: 'por_sku',
    label: 'SKUs Específicos',
    description: 'Previsão individual de SKUs',
    icon: 'sku'
  }
};

// Mapeamento de processos
export const PROCESSOS_MAPPING = {
  '1': { id: '1', label: 'Processo 1' },
  '2': { id: '2', label: 'Processo 2' },
  '3': { id: '3', label: 'Processo 3' },
  '4': { id: '4', label: 'Processo 4' }
};

// Estrutura de linhas com seus processos
export const LINHAS = {
  linha_1: {
    id: 'linha_1',
    label: 'Linha 1',
    description: 'Primeira linha de produção',
    processos: [
      { id: '1', label: 'Processo 1' },
      { id: '2', label: 'Processo 2' },
      { id: '3', label: 'Processo 3' }
    ]
  },
  linha_2: {
    id: 'linha_2',
    label: 'Linha 2',
    description: 'Segunda linha de produção',
    processos: [
      { id: '1', label: 'Processo 1' },
      { id: '2', label: 'Processo 2' },
      { id: '3', label: 'Processo 3' }
    ]
  },
  linha_3: {
    id: 'linha_3',
    label: 'Linha 3',
    description: 'Terceira linha de produção',
    processos: [
      { id: '2', label: 'Processo 2' },
      { id: '4', label: 'Processo 4' }
    ]
  },
  linha_4: {
    id: 'linha_4',
    label: 'Linha 4',
    description: 'Quarta linha de produção',
    processos: [
      { id: '1', label: 'Processo 1' },
      { id: '2', label: 'Processo 2' },
      { id: '3', label: 'Processo 3' }
    ]
  }
};

export const CLASSIFICACOES_ABC = {
  A: {
    label: 'Classe A',
    color: 'green',
    description: 'Alta prioridade'
  },
  B: {
    label: 'Classe B',
    color: 'yellow',
    description: 'Média prioridade'
  },
  C: {
    label: 'Classe C',
    color: 'red',
    description: 'Baixa prioridade'
  }
};

// Helper: extrair ID numérico de strings como "linha_1" → "1"
export const extractNumericId = (id) => {
  if (!id || typeof id !== 'string') return id;
  const match = id.match(/\d+/);
  return match ? match[0] : id;
};
