export const AGGREGATION_DIMENSIONS = {
  LINHA: {
    id: 'linha',
    label: 'Linha',
    description: 'Agregar por linha de produtos',
    icon: 'layers',
    color: 'blue',
    examples: ['Linha A', 'Linha B', 'Linha C']
  },
  PROCESSO: {
    id: 'processo',
    label: 'Processo',
    description: 'Agregar por processo de negócio',
    icon: 'process',
    color: 'purple',
    examples: ['Processo 1', 'Processo 2', 'Processo 3']
  },
  CLASSIFICACAO: {
    id: 'classificacao',
    label: 'Classificação',
    description: 'Agregar por classificação ABC',
    icon: 'tag',
    color: 'orange',
    examples: ['Classe A', 'Classe B', 'Classe C']
  }
};

export const AGGREGATION_MODES = {
  NONE: {
    id: 'none',
    label: 'Sem Agregação',
    description: 'Previsão individual por SKU',
    recommended: false
  },
  SINGLE: {
    id: 'single',
    label: 'Agregação Simples',
    description: 'Selecione uma dimensão',
    recommended: false
  },
  DOUBLE: {
    id: 'double',
    label: 'Agregação Dupla',
    description: 'Combine duas dimensões',
    recommended: true
  },
  TRIPLE: {
    id: 'triple',
    label: 'Agregação Tripla',
    description: 'Combine todas as dimensões',
    recommended: false
  }
};