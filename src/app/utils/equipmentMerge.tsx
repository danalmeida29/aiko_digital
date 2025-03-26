import {
  Equipment,
  EquipmentModel,
  EquipmentPositionHistory,
  EquipmentStateHistory,
} from '../hooks/equipmentTypes';

export const equipmentMerge = (
  equipments: Equipment[],
  models: EquipmentModel[],
  positionHistory: EquipmentPositionHistory[],
  stateHistory: EquipmentStateHistory[]
) => {
  const modelsMap = new Map(models.map((model) => [model.id, model]));
  const positionMap = new Map(
    positionHistory.map((pos) => [pos.equipmentId, pos.positions])
  );

  const stateHistoryMap = new Map<string, EquipmentStateHistory[]>();
  stateHistory.forEach((state) => {
    if (!stateHistoryMap.has(state.equipmentId)) {
      stateHistoryMap.set(state.equipmentId, []);
    }
    stateHistoryMap.get(state.equipmentId)?.push(state);
  });

  return equipments.map((equipment) => {
    const model = modelsMap.get(equipment.equipmentModelId);
    const positions = positionMap.get(equipment.id);
    const history = stateHistoryMap.get(equipment.id) || [];

    return {
      ...equipment,
      modelName: model?.name || 'Desconhecido',
      hourlyEarnings: model?.hourlyEarnings || [],
      positions, // Aqui agora temos TODAS as posições do equipamento
      stateHistory: history,
    };
  });
};
