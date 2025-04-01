'use client';
import * as React from 'react';
import { useSelectedId } from '@/app/context/SelectedIdContext';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  operando: {
    label: 'Operando',
    color: '#2ecc71',
  },
  parado: {
    label: 'Parado',
    color: '#f1c40f',
  },
  manutencao: {
    label: 'Manutenção',
    color: '#e74c3c',
  },
} satisfies ChartConfig;

export function ChartComponent() {
  const { chartData, selectedId } = useSelectedId();
  const [transformedChartData, setTransformedChartData] = useState([]);
  const stateIds = useMemo(
    () => ({
      operando: '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f',
      parado: 'baff9783-84e8-4e01-874b-6fd743b875ad',
      manutencao: '0808344c-454b-4c36-89e8-d7687e692d57',
    }),
    []
  );

  // UseEffect para debugar e ver as atualizações do chartData
  useEffect(() => {
    console.log('chartData atualizado no ChartComponent:', chartData);
  }, [chartData]);

  useEffect(() => {
    const newData = chartData.flatMap(({ date, status }) => {
      const datesArray = Array.isArray(date) ? date : [date];
      return datesArray.map((d: string) => ({
        date: d,
        operando: status === stateIds.operando ? 1 : 0,
        parado: status === stateIds.parado ? 1 : 0,
        manutencao: status === stateIds.manutencao ? 1 : 0,
      }));
    });
    setTransformedChartData(newData);
  }, [chartData, selectedId, stateIds]);

  return (
    <Card className="rounded-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Histórico - Equipamento</CardTitle>
          <CardDescription>Histórico de estado do Equipamento:</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={transformedChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = date.toLocaleString('default', {
                  month: 'short',
                });

                return `${day}/${month}   `;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="operando"
              fill={chartConfig.operando.color}
              radius={4}
            />
            <Bar dataKey="parado" fill={chartConfig.parado.color} radius={4} />
            <Bar
              dataKey="manutencao"
              fill={chartConfig.manutencao.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
