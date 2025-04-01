'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProcessedData } from '../hooks/useProcessedData';
interface ChartData {
  date: string[];
  status: string;
  hours: string[];
}
interface SelectedIdContextValue {
  selectedId: string | null;
  chartData: ChartData[];
  getEquipmentData: (id: string) => void;
}

const SelectedIdContext = createContext<SelectedIdContextValue | null>(null);

export function SelectedIdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { statesArray } = useProcessedData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  function getEquipmentData(id: string) {
    setSelectedId(id);
  }

  useEffect(() => {
    if (!selectedId || !statesArray?.length) return;

    const selectEquipment = statesArray.find(
      (equipment: { id: string }) => equipment.id === selectedId
    );
    if (!selectEquipment) return;

    const status = selectEquipment.states;
    const newStatusData = status.map(
      (stateData: { date: string[]; matchedStateId: string }) => ({
        date: Array.isArray(stateData.date) ? stateData.date : [stateData.date],
        status: stateData.matchedStateId,
      })
    );

    setChartData(newStatusData);
  }, [selectedId, statesArray]);

  return (
    <SelectedIdContext.Provider
      value={{
        selectedId,
        chartData,
        getEquipmentData,
      }}
    >
      {children}
    </SelectedIdContext.Provider>
  );
}

export function useSelectedId() {
  const context = useContext(SelectedIdContext);
  if (!context) {
    throw new Error('useSelectedId must be used within a SelectedIdProvider');
  }
  return context;
}
