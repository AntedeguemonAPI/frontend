'use client';
import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import { Chart } from '@/components/core/chart';

interface SpellingErrorsChartProps {
  totalWithErrors: number;
  total: number;
}

export function SpellingErrorsChart({ totalWithErrors, total }: SpellingErrorsChartProps) {
  const withErrors = Number(totalWithErrors) || 0;
  const withoutErrors = Math.max((Number(total) || 0) - withErrors, 0);

  console.log('[SpellingErrorsChart] props:', { totalWithErrors, total });
console.log('[SpellingErrorsChart] series:', [Number(totalWithErrors), Number(total) - Number(totalWithErrors)]);


  return (
    <Card>
      <CardHeader title="Erros Ortográficos" />
      <CardContent>
        <Chart
          height={300}
          width='100%'
          type="donut"
          series={[withErrors, withoutErrors]}
          options={{
            labels: ['Com erro', 'Sem erro'],
            colors: ['#e91e63', '#00bcd4'],
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
