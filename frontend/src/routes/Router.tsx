import { createBrowserRouter } from "react-router";

import layout from "../components/Layout";

import dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    Component: layout,
    children: [
      { index: true, Component: dashboard },
      { path: "dashboard", Component: dashboard },
    ]
  },
  {
    path: "/dashboard"
  },
  {
    path: "/gerar-previsao"
  },
  {
    path: "/automacao"
  },
  {
    path: "/historico"
  },
  {
    path: "/fontes-dados"
  },
  {
    path: "/importar"
  },
  {
    path: "/relatorios"
  },
  {
    path: "/configuracoes"
  },
  {
    path: "/equipe"
  },
]);

export default router;
