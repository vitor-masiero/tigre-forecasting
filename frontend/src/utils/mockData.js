/**
 * Dados fictícios para o Dashboard seguindo a estrutura real da API
 */
export const MOCK_DASHBOARD_DATA = {
  preview: [
    { ds: '2023-08-01', yhat: 92000 },
    { ds: '2023-09-01', yhat: 97000 },
    { ds: '2023-10-01', yhat: 103000 },
    { ds: '2023-11-01', yhat: 108000 },
    { ds: '2023-12-01', yhat: 122000 },
    { ds: '2024-01-01', yhat: 95000 },
    { ds: '2024-02-01', yhat: 105000 },
    { ds: '2024-03-01', yhat: 112000 },
    { ds: '2024-04-01', yhat: 108000 },
    { ds: '2024-05-01', yhat: 115000 },
    { ds: '2024-06-01', yhat: 120000 },
    { ds: '2024-07-01', yhat: 118000 }
  ],
  metrics: {
    global: {
      metrics_global: {
        'WMAPE (%)': 5.8,
        'Bias (%)': 25.1
      }
    },
    trend: {
      first_value: 92000,
      last_value: 118000
    },
    feature_importance: [
      { feature: 'selic', importance_pct: 35.5 },
      { feature: 'incc', importance_pct: 22.1 },
      { feature: 'month_sin', importance_pct: 18.4 },
      { feature: 'rolling_mean_3', importance_pct: 12.2 },
      { feature: 'is_holiday', importance_pct: 11.8 }
    ]
  },
  // Mantemos estes para compatibilidade se algum componente usar
  fatores_influencia: [
    { fator: 'Sazonalidade', impacto: 35, tendencia: 'up' },
    { fator: 'Preço Médio', impacto: -12, tendencia: 'down' },
    { fator: 'Promoções', impacto: 18, tendencia: 'up' },
    { fator: 'Indicadores Econômicos', impacto: 5, tendencia: 'up' }
  ],
  previsoes_recentes: [
    { id: 132123, produto: 'SKU-99201', data: '2024-02-10', valor: 45200, status: 'Concluído' },
    { id: 132124, produto: 'SKU-88342', data: '2024-02-11', valor: 28400, status: 'Em Processamento' },
    { id: 132125, produto: 'SKU-77123', data: '2024-02-11', valor: 15900, status: 'Concluído' },
    { id: 132126, produto: 'SKU-55432', data: '2024-02-12', valor: 82100, status: 'Pendente' }
  ]
};
