import { useEffect, useMemo, useState } from 'react';
import { useMergedEquipmentData } from '@/app/hooks/useMergedEquipmentData';

export function useProcessedData() {
  const { mergedData } = useMergedEquipmentData();
  const stateIds = useMemo(
    () => ({
      operando: '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f',
      parado: 'baff9783-84e8-4e01-874b-6fd743b875ad',
      manutencao: '0808344c-454b-4c36-89e8-d7687e692d57',
    }),
    []
  );
  const [statesArray, setStatesArray] = useState([]);
  useEffect(() => {
    if (Array.isArray(mergedData)) {
      const groupedData: unknown[] = mergedData
        .filter((item) => item.stateHistory)
        .map((item) => {
          const matchedStates: { [matchedStateId: string]: string[] } = {};

          item.stateHistory.forEach((history) => {
            history.states.forEach((state) => {
              const matchedStateId = Object.values(stateIds).find(
                (id) => id === state.equipmentStateId
              );
              if (matchedStateId) {
                if (!matchedStates[matchedStateId]) {
                  matchedStates[matchedStateId] = [];
                }
                matchedStates[matchedStateId].push(state.date);
              }
            });
          });

          return {
            id: item.id,
            equipmentModelId: item.equipmentModelId,
            modelName: item.modelName,
            name: item.name,
            states: Object.entries(matchedStates).map(
              ([matchedStateId, dates]) => ({
                matchedStateId,
                date: dates,
              })
            ),
          };
        });

      setStatesArray(groupedData);
    }
  }, [mergedData, stateIds]);

  return { statesArray };
}
