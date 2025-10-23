export const FAMILIAS = {
  FAMILIA_1: {
    id: 'familia_1',
    label: 'Família 1',
    description: 'Linha de produtos A',
    processos: [
      { id: 'processo_1', label: 'Processo 1', skus: 45 },
      { id: 'processo_2', label: 'Processo 2', skus: 32 },
      { id: 'processo_3', label: 'Processo 3', skus: 28 }
    ]
  },
  FAMILIA_2: {
    id: 'familia_2',
    label: 'Família 2',
    description: 'Linha de produtos B',
    processos: [
      { id: 'processo_1', label: 'Processo 1', skus: 52 },
      { id: 'processo_2', label: 'Processo 2', skus: 38 },
      { id: 'processo_3', label: 'Processo 3', skus: 41 }
    ]
  },
  FAMILIA_3: {
    id: 'familia_3',
    label: 'Família 3',
    description: 'Linha de produtos C',
    processos: [
      { id: 'processo_2', label: 'Processo 2', skus: 29 },
      { id: 'processo_4', label: 'Processo 4', skus: 36 }
    ]
  },
  FAMILIA_4: {
    id: 'familia_4',
    label: 'Família 4',
    description: 'Linha de produtos D',
    processos: [
      { id: 'processo_1', label: 'Processo 1', skus: 48 },
      { id: 'processo_2', label: 'Processo 2', skus: 34 },
      { id: 'processo_3', label: 'Processo 3', skus: 39 }
    ]
  }
};

export const GRANULARITY_LEVELS = {
  TODAS_FAMILIAS: {
    id: 'todas_familias',
    label: 'Todas as Famílias',
    description: 'Previsão agregada de todas as famílias',
    icon: 'all'
  },
  POR_FAMILIA: {
    id: 'por_familia',
    label: 'Por Família',
    description: 'Selecione famílias específicas',
    icon: 'family'
  },
  POR_PROCESSO: {
    id: 'por_processo',
    label: 'Por Processo',
    description: 'Selecione processos dentro de famílias',
    icon: 'process'
  },
  POR_SKU: {
    id: 'por_sku',
    label: 'SKUs Específicos',
    description: 'Previsão individual de SKUs',
    icon: 'sku'
  }
};