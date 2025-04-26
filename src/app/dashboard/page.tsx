'use client';

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { useUser } from '@/hooks/use-user';
import { Tickets } from '@/components/dashboard/overview/tickets';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalTickets } from '@/components/dashboard/overview/total-tickets';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { SentimentalChart } from '@/components/dashboard/overview/sentimental-chart';
import { WordChart } from '@/components/dashboard/overview/word-chart';

export default function Page(): React.JSX.Element {
  const { user } = useUser();

  React.useEffect(() => {
    console.log('[DASHBOARD] Contexto do usuário:', user);
  }, [user]);

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Tickets diff={8} trend="up" sx={{ height: '100%' }} value="320" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalTickets open={45} closed={275} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="15k" />
      </Grid>
      <Grid lg={8} xs={12}>
        <WordChart
          chartSeries={[{ name: 'Frequência', data: [120, 95, 80, 75, 70, 65, 60, 55, 50, 45] }]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <SentimentalChart
          chartSeries={[50, 30, 20]}
          labels={['Positivo', 'Negativo', 'Neutro']}
          sx={{ height: '100%' }}
        />
      </Grid>

    </Grid>
  );
}