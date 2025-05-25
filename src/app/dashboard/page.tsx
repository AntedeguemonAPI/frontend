'use client';

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import { useUser } from '@/hooks/use-user';
import { useDashboardData } from '@/hooks/useDashboardData';

import { Tickets } from '@/components/dashboard/overview/tickets';
import { TotalSla } from '@/components/dashboard/overview/total-tickets';
import { WordChart } from '@/components/dashboard/overview/word-chart';
import { PieChartSLA } from '@/components/dashboard/overview/pie-chart-sla';
import { PieChartStatus } from '@/components/dashboard/overview/pie-chart-status';
import { TopicFrequencyChart } from '@/components/dashboard/overview/topic-frequency-chart';
import { SpellingErrorsChart } from '@/components/dashboard/overview/spelling-errors-chart';

export default function Page(): React.JSX.Element {
  const { user } = useUser();
  const { data, loading } = useDashboardData();

  React.useEffect(() => {
    console.log('[DASHBOARD] Contexto do usuário:', user);
  }, [user]);

  if (loading || !data) {
    return <p style={{ padding: '1rem' }}>Carregando dashboard...</p>;
  }

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12}>
        <Tickets diff={8} trend="up" sx={{ height: '90%' }} value={data.averageResolutionTime} />
      </Grid>

      <Grid lg={6} sm={6} xs={12}>
        <TotalSla slaMet={data.slaMet} slaNotMet={data.slaNotMet} sx={{ height: '90%' }} />
      </Grid>

      <Grid lg={4} sm={6} xs={12}>
        <PieChartSLA passed={data.slaMet} failed={data.slaNotMet} />
      </Grid>

      <Grid lg={4} sm={6} xs={12}>
        <PieChartStatus open={data.statusOpen} closed={data.statusClosed} />
      </Grid>

      <Grid lg={4} sm={6} xs={12}>
        <SpellingErrorsChart totalWithErrors={data.spellingErrors} total={data.totalTickets} />
      </Grid>

    <Grid lg={12} xs={12}>
      <WordChart
        chartSeries={[{ name: 'Frequência', data: data.top10Words.map(item => item[1]) }]}
        categories={data.top10Words.map(item => item[0])}
        sx={{ height: '90%' }}
      />
    </Grid>

    <Grid lg={12} xs={12}>
      <TopicFrequencyChart
        chartSeries={[{ name: 'Ocorrências', data: data.topicFrequencies.slice(0, 10) }]}
        categories={data.topTopics}
      />
    </Grid>
    </Grid>
  );
}
