'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Chart } from '@/components/core/chart';

interface PieChartStatusProps {
  open: number;
  closed: number;
}

export function PieChartStatus({ open, closed }: PieChartStatusProps) {
  const safeOpen = Number(open) || 0;
  const safeClosed = Number(closed) || 0;

  console.log('[PieChartStatus] props:', { open, closed });
console.log('[PieChartStatus] series:', [Number(open), Number(closed)]);


  return (
    <Card>
      <CardHeader title="Status dos Chamados" />
      <CardContent>
        <Chart
          type="donut"
          height={300}
          width='100%'
          series={[safeOpen, safeClosed]}
          options={{
            labels: ['Abertos', 'Fechados'],
            colors: ['#ff9800', '#2196f3'],
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
