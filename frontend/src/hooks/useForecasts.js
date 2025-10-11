import { useState, useEffect } from "react";

export function useForecasts(filters) {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aqui você faria a chamada para sua API
    const fetchForecasts = async () => {
      try {
        setLoading(true);
        // const response = await fetch('/api/forecasts', {
        //   method: 'POST',
        //   body: JSON.stringify(filters)
        // });
        // const data = await response.json();
        // setForecasts(data);

        // Dados mockados por enquanto
        setForecasts([
          // ... seus dados
        ]);
      } catch (error) {
        console.error("Erro ao buscar previsões:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, [filters]);

  return { forecasts, loading };
}
