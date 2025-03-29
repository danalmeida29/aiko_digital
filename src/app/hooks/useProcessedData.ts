
import { useEffect, useState } from "react";
import { useMergedEquipmentData } from "@/app/hooks/useMergedEquipmentData"


export function useProcessedData() {
    const { mergedData } = useMergedEquipmentData();
    const stateIds = {
        idOperando: '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f',
        idParado: 'baff9783-84e8-4e01-874b-6fd743b875ad',
        idManutencao: '0808344c-454b-4c36-89e8-d7687e692d57',
    };
    const [statesArray, setStatesArray] = useState<any>([]);

    useEffect(() => {
        if (Array.isArray(mergedData)) {
            const groupedData: any[] = [];
    
            mergedData
                .filter(item => item.stateHistory) // Filtra itens que possuem stateHistory
                .forEach(item => {
                    item.stateHistory.forEach(history => {
                        // Agrupa os states por matchedStateId
                        const matchedStates: { [matchedStateId: string]: string[] } = {};
    
                        history.states.forEach(state => {
                            const matchedStateId = Object.values(stateIds).find(id => id === state.equipmentStateId);
                            if (matchedStateId) {
                                // Se o matchedStateId não existe no agrupamento, inicializa o array de datas
                                if (!matchedStates[matchedStateId]) {
                                    matchedStates[matchedStateId] = [];
                                }
                                // Adiciona a data ao array correspondente ao matchedStateId
                                matchedStates[matchedStateId].push(state.date);
                            }
                        });
    
                        // Agora, montamos o array de states agrupados por matchedStateId
                        const states = Object.entries(matchedStates).map(([matchedStateId, dates]) => ({
                            matchedStateId,
                            date: dates
                        }));
    
                        // Atualiza o stateHistory do equipamento com os states agrupados
                        groupedData.push({
                            equipmentId: history.equipmentId,
                            states
                        });
                    });
                });

            setStatesArray(groupedData);
        }
    }, [mergedData]);

    return { statesArray };

}