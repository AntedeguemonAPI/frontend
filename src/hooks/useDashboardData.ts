'use client'

import { useEffect, useState } from 'react'

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
  top10Words: [string, number][];
}


export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_DB_URL;
        const res = await fetch(`${backendUrl}/dashboard_dados`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(`[${res.status}] ${res.statusText}`)
        }

    const result = await res.json();

    const mockTop10Words: [string, number][] = [
      ["solicitante", 987],
      ["solicito", 455],
      ["identificar", 385],
      ["antena", 329],
      ["colaborador", 328],
      ["offline", 309],
      ["ordem", 302],
      ["email", 268],
      ["switch", 248],
      ["preventivo", 236],
    ];

    // adiciona o mock no result
    const resultWithMock = { ...result, top10Words: mockTop10Words };

    console.log('[useDashboardData] 🔄 Dados recebidos:', resultWithMock);
    setData(resultWithMock);
      } catch (err) {
        console.error('[useDashboardData] ❌ Erro ao buscar dados do dashboard:', err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading }
}
