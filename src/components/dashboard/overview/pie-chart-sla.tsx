'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Chart } from '@/components/core/chart';

interface PieChartSLAProps {
  passed: number;
  failed: number;
}

export function PieChartSLA({ passed, failed }: PieChartSLAProps) {
  const safePassed = Number(passed) || 0;
  const safeFailed = Number(failed) || 0;

  console.log('[PieChartSLA] props:', { passed, failed });
console.log('[PieChartSLA] series:', [Number(passed), Number(failed)]);


  return (
    <Card>
      <CardHeader title="Chamados com SLA" />
      <CardContent>
        <Chart
          type="donut"
          height={300}
          width='100%'
          series={[safePassed, safeFailed]}
          options={{
            labels: ['Dentro do SLA', 'Fora do SLA'],
            colors: ['#4caf50', '#f44336'],
            legend: { position: 'bottom' },
            dataLabels: {
              enabled: true,
formatter: (val: unknown): string => {
  const num = typeof val === 'number' ? val : Number(val);
  return isNaN(num) ? '0%' : `${num.toFixed(1)}%`;
}
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
