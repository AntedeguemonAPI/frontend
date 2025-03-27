'use client';

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { useUser } from '@/hooks/use-user';
import { Budget } from '@/components/dashboard/overview/budget';
import { WordChart } from '@/components/dashboard/overview/word-chart';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';

export default function Page(): React.JSX.Element {
  const { user, isLoading, error } = useUser();

  React.useEffect(() => {
    console.log('[DASHBOARD] Contexto do usuário:', user);
  }, [user]);

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid lg={8} xs={12}>
        <WordChart
          chartSeries={[{ name: 'Frequência', data: [120, 95, 80, 75, 70, 65, 60, 55, 50, 45] }]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}
