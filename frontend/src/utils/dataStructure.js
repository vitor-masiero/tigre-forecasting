export const LINHAS = {
  LINHA_1: {
    id: 'linha_1',
    label: 'Linha 1',
    description: 'Linha de produtos 1',
    processos: [
      { 
        id: 'processo_1', 
        label: 'Processo 1',
        classificacoes: ['A', 'B', 'C']
      },
      { 
        id: 'processo_2', 
        label: 'Processo 2',
        classificacoes: ['A', 'B', 'C']
      },
      { 
        id: 'processo_3', 
        label: 'Processo 3',
        classificacoes: ['A', 'B', 'C']
      }
    ]
  },
  LINHA_2: {
    id: 'linha_2',
    label: 'Linha 2',
    description: 'Linha de produtos 2',
    processos: [
      { 
        id: 'processo_1', 
        label: 'Processo 1',
        classificacoes: ['A', 'B', 'C']
      },
      { 
        id: 'processo_2', 
        label: 'Processo 2',
        classificacoes: ['A', 'B', 'C']
      },
      { 
        id: 'processo_3', 
        label: 'Processo 3',
        classificacoes: ['A', 'B', 'C']
      }
    ]
  },
  LINHA_3: {
    id: 'linha_3',
    label: 'Linha 3',
    description: 'Linha de produtos 3',
    processos: [
      { 
        id: 'processo_2', 
        label: 'Processo 2',
        classificacoes: ['A', 'B', 'C']
      },
      { 
        id: 'processo_4', 
        label: 'Processo 4',
        classificacoes: ['A', 'B', 'C']
      }
    ]
  },
  LINHA_4: {
    id: 'linha_4',
    label: 'Linha 4',
    description: 'Linha de produtos 4',
    processos: [
      { 
        id: 'processo_1', 
        label: 'Processo 1',
        classificacoes: ['A', 'B', 'C']
      },
      { 
        id: 'processo_2', 
        label: 'Processo 2',
        classificacoes: ['A', 'B', 'C']
      },
      { 
        id: 'processo_3', 
        label: 'Processo 3',
        classificacoes: ['A', 'B', 'C']
      }
    ]
  }
};

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

export const CLASSIFICACOES_ABC = {
  A: { id: 'A', label: 'Classe A', color: 'emerald', description: 'Alta prioridade' },
  B: { id: 'B', label: 'Classe B', color: 'blue', description: 'Média prioridade' },
  C: { id: 'C', label: 'Classe C', color: 'orange', description: 'Baixa prioridade' }
};
