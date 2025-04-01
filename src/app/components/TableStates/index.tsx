'use client';
import * as React from 'react';
import { useSelectedId } from '@/app/context/SelectedIdContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useMemo, useState } from 'react';

export function TableComponent() {
  const { chartData, selectedId } = useSelectedId();
  const [transformedChartData, setTransformedChartData] = useState<
    { date: string; status: string; hours: string[] }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const stateIds = useMemo(
    () => ({
      operando: '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f',
      parado: 'baff9783-84e8-4e01-874b-6fd743b875ad',
      manutencao: '0808344c-454b-4c36-89e8-d7687e692d57',
    }),
    []
  );

  useEffect(() => {
    console.log('chartData atualizado no TableComponent:', chartData);
  }, [chartData]);

  useEffect(() => {
    const newData = chartData.flatMap(({ date, status, hours }) => {
      const datesArray = Array.isArray(date) ? date : [date];
      return datesArray.map((d: string) => ({
        date: d,
        status,
        hours: hours || [],
      }));
    });

    setTransformedChartData(newData);
  }, [chartData, selectedId, stateIds]);

  // Organiza os dados por status e agrupa as datas e horas
  const organizeDataByStatus = (
    chartData: { date: string; status: string; hours: string[] }[]
  ) => {
    return chartData.reduce(
      (acc, { date, status, hours }) => {
        if (!acc[status]) {
          acc[status] = {
            dates: [],
            status,
            hours: [],
          };
        }
        acc[status].dates.push(date);
        acc[status].hours.push(...hours);
        return acc;
      },
      {} as Record<string, { dates: string[]; status: string; hours: string[] }>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupHoursByDay = (dates: string[], hours: string[]) => {
    const groupDates: Record<string, { day: string; hours: string[] }> = {};

    dates.forEach((dateStr) => {
      const date = new Date(dateStr);
      const monthNames = [
        'jan',
        'fev',
        'mar',
        'abr',
        'mai',
        'jun',
        'jul',
        'ago',
        'set',
        'out',
        'nov',
        'dez',
      ];
      const day = `${String(date.getDate()).padStart(2, '0')} / ${monthNames[date.getMonth()]} / ${date.getFullYear()}`;
      const hour = `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;

      if (!groupDates[day]) {
        groupDates[day] = { day, hours: [] };
      }

      const lastHour = groupDates[day].hours[groupDates[day].hours.length - 1];

      // Se a última hora for maior do que a próxima, ignora
      if (lastHour && lastHour > hour) {
        return;
      }

      groupDates[day].hours.push(hour);
    });

    return groupDates;
  };

  // Formata os dados corretamente
  const formatChartData = (
    chartData: Record<
      string,
      { dates: string[]; status: string; hours: string[] }
    >
  ) => {
    const transformedData: Record<
      string,
      { date: Record<string, { day: string; hours: string[] }>; status: string }
    > = {};

    for (const status in chartData) {
      const { dates, hours } = chartData[status];
      transformedData[status] = {
        date: groupHoursByDay(dates, hours),
        status: chartData[status].status,
      };
    }

    return transformedData;
  };

  const structuredChartData = organizeDataByStatus(transformedChartData);
  const formattedChartData = formatChartData(structuredChartData);

  console.log('formattedChartData:', formattedChartData);

  // Agrupar dados por data e organizar por status
  const groupedData = useMemo(() => {
    return Object.entries(formattedChartData).reduce(
      (acc, [status, { date }]) => {
        Object.entries(date).forEach(([day, { hours }]) => {
          if (!acc[day])
            acc[day] = { Operando: [], Parado: [], Manutenção: [] };

          if (status === stateIds.operando) acc[day].Operando.push(...hours);
          if (status === stateIds.parado) acc[day].Parado.push(...hours);
          if (status === stateIds.manutencao)
            acc[day].Manutenção.push(...hours);
        });

        return acc;
      },
      {} as Record<
        string,
        { Operando: string[]; Parado: string[]; Manutenção: string[] }
      >
    );
  }, [formattedChartData, stateIds]);

  const totalPages = Math.ceil(Object.keys(groupedData).length / itemsPerPage);
  const paginatedData = Object.entries(groupedData).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Histórico de Estados do Equipamento
      </h2>
      <Table>
        <TableHeader className="border-t-2 border-b-2 items-center flex-row">
          <TableRow className="bg-gray-200">
            <TableHead className=" border-l-2 border-r-1 border-gray-300">
              Data
            </TableHead>
            <TableHead className=" border-r-1 border-gray-300">
              Operando
            </TableHead>
            <TableHead className=" border-r-1 border-gray-300">
              Parado
            </TableHead>
            <TableHead className="  border-r-2 border-gray-300">
              Manutenção
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-t-2 border-b-2">
          {paginatedData.map(([date, records]) => {
            const typedRecords = records as {
              Operando: string[];
              Parado: string[];
              Manutenção: string[];
            };
            return (
              <TableRow key={date}>
                <TableCell className=" border-l-2 border-r-1 border-gray-300">
                  {date}
                </TableCell>
                <TableCell className=" border-r-1 border-gray-300">
                  {typedRecords.Operando.length > 0
                    ? typedRecords.Operando.join(', ')
                    : '-'}
                </TableCell>
                <TableCell className=" border-r-1 border-gray-300">
                  {typedRecords.Parado.length > 0
                    ? typedRecords.Parado.join(', ')
                    : '-'}
                </TableCell>
                <TableCell className=" border-r-2 border-gray-300">
                  {typedRecords.Manutenção.length > 0
                    ? typedRecords.Manutenção.join(', ')
                    : '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Controles de Paginação */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded-l-md hover:bg-gray-400 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span className="px-4 py-2">
          Página {currentPage} de {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-gray-300 rounded-r-md hover:bg-gray-400 disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
