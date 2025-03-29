"use client"
import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMergedEquipmentData } from "@/app/hooks/useMergedEquipmentData"
import { useSelectedId } from "@/app/hooks/useSelectId"

const chartConfig = {
  operando: {
    label: "Operando",
    color: "#2ecc71",
  },
  parado: {
    label: "Parado",
    color: "#f1c40f",
  },
  manutencao: {
    label: "Manutenção",
    color: "#e74c3c",
  },
} satisfies ChartConfig

export function ChartComponent() {
    console.log("ChartComponent renderizou!");

    const { chartData, selectedId } = useSelectedId();
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("operando")
    const [transformedChartData, setTransformedChartData] = useState<any[]>([]);
    const stateIds = {
        operando: '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f',
        parado: 'baff9783-84e8-4e01-874b-6fd743b875ad',
        manutencao: '0808344c-454b-4c36-89e8-d7687e692d57',
    };
    useSelectedId();
    console.log("chartData no ChartComponent:", chartData);

    useEffect(() => {
        if (!chartData || chartData.length === 0) return;

        const newData = chartData.flatMap(({ date, status }) =>
            date.map((d: string) => ({
                date: d,
                operando: status === stateIds.operando ? 1 : 0,
                parado: status === stateIds.parado ? 1 : 0,
                manutencao: status === stateIds.manutencao ? 1 : 0,
            }))
        );

        setTransformedChartData(newData);
    }, [chartData, selectedId]);
    
    // console.log("transformedChartData:", transformedChartData);

    const total = useMemo(() => ({
        operando: transformedChartData.reduce((acc, curr) => acc + curr.operando, 0),
        parado: transformedChartData.reduce((acc, curr) => acc + curr.parado, 0),
        manutencao: transformedChartData.reduce((acc, curr) => acc + curr.manutencao, 0),
    }),[transformedChartData]);

    // console.log("total:", total);

  return (
    <Card className="rounded-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Historico - Equipamento</CardTitle>
          <CardDescription>
            Historico de estado do Equipamento:
          </CardDescription>
        </div>
        <div className="flex">
          {["operando", "parado", "manutencao"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className=" cursor-pointer relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label} <br/>
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={transformedChartData}
            margin={{
              left: 8,
              right: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}