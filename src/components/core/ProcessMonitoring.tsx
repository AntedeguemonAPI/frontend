'use client';

import { useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

export function ProcessMonitoring(): JSX.Element {
  const { addNotification, notifiedIds, setNotifiedIds } = useNotification();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PROCESSING_SERVER_URL}preprocessamento/`);
        const data = await res.json();

        const concluded = data.filter((item: any) => item.preprocessamento_concluido === 1);
        const newIds = concluded
          .filter((item: any) => !notifiedIds.includes(item.id))
          .map((item: any) => item.id);

        if (newIds.length > 0) {
          newIds.forEach((id: number) => {
            // AGORA PASSA O idProcess E message
            addNotification(id, `Processamento ID ${id} foi concluído!`);
          });
          setNotifiedIds(prev => [...prev, ...newIds]);
        }
      } catch (error) {
        console.error('Erro ao monitorar processos:', error);
      }
    }, 30000); // busca a cada 30 segundos

    return () => clearInterval(interval);
  }, [addNotification, notifiedIds, setNotifiedIds]);

  return null; // componente invisível
}
