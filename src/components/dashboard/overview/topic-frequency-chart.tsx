'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Chart } from '@/components/core/chart';

interface TopicFrequencyChartProps {
  chartSeries: { name: string; data: number[] }[];
  categories: string[];
}

export function TopicFrequencyChart({ chartSeries, categories }: TopicFrequencyChartProps) {
  const [limit, setLimit] = useState('25');

  const handleChange = (event: SelectChangeEvent) => {
    setLimit(event.target.value);
  };

  const safeData = Array.isArray(chartSeries?.[0]?.data)
    ? chartSeries[0].data.slice(0, parseInt(limit)).map((val) => Number(val) || 0)
    : [];

  const safeCategories = Array.isArray(categories)
    ? categories.slice(0, parseInt(limit)).map((val) => val?.toString?.() || '-')
    : [];

  console.log('[TopicFrequencyChart] safeData:', safeData);
  console.log('[TopicFrequencyChart] safeCategories:', safeCategories);

  return (
    <Card>
      <CardHeader
        title="Tópicos Frequentes"
      />
      <CardContent>
        <Chart
          width='100%'
          height={350}
          type="bar"
          series={[{ name: 'Ocorrências', data: safeData }]}
          options={{
            xaxis: { categories: safeCategories },
            legend: { show: false },
            plotOptions: { bar: { columnWidth: '40px' } },
            dataLabels: {
              enabled: true,
              formatter: (val: unknown) => {
                const num = typeof val === 'number' ? val : Number(val);
                return isNaN(num) ? '0' : `${num}`;
              },
              style: { fontWeight: 'bold' }
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
