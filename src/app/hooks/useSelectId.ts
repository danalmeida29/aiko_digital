import { useEffect, useState } from 'react';
import { useProcessedData } from './useProcessedData';

export function useSelectedId() {
  const { statesArray } = useProcessedData()
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const getEquipmentData = (id: string) => {
    setSelectedId(id);
  };

    useEffect(() => {
        if (!selectedId || !statesArray.length) return;
        
        const selectEquipment = statesArray.find((equipment: { equipmentId: string }) => equipment.equipmentId === selectedId);
        const status = selectEquipment.states;

        const statusData = status.map((stateData: { date: string[]; matchedStateId: string }) => ({
            date: stateData.date,
            status: stateData.matchedStateId,
        }));
        setChartData(statusData);
        console.log(statusData)
    }, [selectedId, statesArray]);

    return { chartData, selectedId, getEquipmentData };
}