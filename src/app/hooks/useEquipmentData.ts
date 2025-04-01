// src/hooks/useEquipmentData.ts
import { useState, useEffect } from 'react';
import {
  Equipment,
  EquipmentModel,
  EquipmentState,
  EquipmentPositionHistory,
  EquipmentStateHistory,
} from './equipmentTypes';

const useEquipmentData = () => {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [equipmentModelData, setEquipmentModelData] = useState<
    EquipmentModel[]
  >([]);
  const [equipmentStateData, setEquipmentStateData] = useState<
    EquipmentState[]
  >([]);
  const [equipmentPositionHistoryData, setEquipmentPositionHistoryData] =
    useState<EquipmentPositionHistory[]>([]);
  const [equipmentStateHistoryData, setEquipmentStateHistoryData] = useState<
    EquipmentStateHistory[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados JSON a partir de URLs
  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha ao carregar os dados');
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      console.error('Erro ao carregar os dados:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro desconhecido');
      }
      return null;
    }
  };

  // Usando useEffect para carregar os dados ao montar o componente
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      const equipment = await fetchData(
        process.env.NEXT_PUBLIC_EQUIPMENT_URL || ''
      );
      const equipmentModel = await fetchData(
        process.env.NEXT_PUBLIC_EQUIPMENT_MODEL_URL || ''
      );
      const equipmentState = await fetchData(
        process.env.NEXT_PUBLIC_EQUIPMENT_STATE_URL || ''
      );
      const equipmentPositionHistory = await fetchData(
        process.env.NEXT_PUBLIC_EQUIPMENT_POSITION_HISTORY_URL || ''
      );
      const equipmentStateHistory = await fetchData(
        process.env.NEXT_PUBLIC_EQUIPMENT_STATE_HISTORY_URL || ''
      );

      setEquipmentData(equipment);
      setEquipmentModelData(equipmentModel);
      setEquipmentStateData(equipmentState);
      setEquipmentPositionHistoryData(equipmentPositionHistory);
      setEquipmentStateHistoryData(equipmentStateHistory);

      setLoading(false);
    };

    fetchAllData();
  }, []);

  return {
    equipmentData,
    equipmentModelData,
    equipmentStateData,
    equipmentPositionHistoryData,
    equipmentStateHistoryData,
    loading,
    error,
  };
};

export default useEquipmentData;
