'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  averageResolutionTime: string;
  slaMet: number;
  slaNotMet: number;
  statusOpen: number;
  statusClosed: number;
  spellingErrors: number;
  totalTickets: number;
  topTopics: string[];
  topicFrequencies: number[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const payload: DashboardData = {
        averageResolutionTime: '5.9 dias',
        slaMet: 1074,
        slaNotMet: 353,
        statusOpen: 300,
        statusClosed: 1127,
        spellingErrors: 87,
        totalTickets: 1427,
        topTopics: [
          'Erro',
          'Senha',
          'Acesso',
          'Sistema',
          'Atualizar',
          'Conexão',
          'Usuário',
          'Rede',
          'Login',
          'Suporte',
        ],
        topicFrequencies: [120, 95, 80, 75, 70, 65, 60, 55, 50, 45],
      };

      console.log('[useDashboardData] Dados simulados carregados:', payload);

      setData(payload);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
}
