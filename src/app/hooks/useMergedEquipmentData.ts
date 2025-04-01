import { useState, useEffect } from 'react';
import useEquipmentData from './useEquipmentData';
import { equipmentMerge } from '../utils/equipmentMerge';
import { MergedEquipment } from './equipmentTypes';

export const useMergedEquipmentData = () => {
  const {
    equipmentData,
    equipmentModelData,
    equipmentPositionHistoryData,
    equipmentStateHistoryData,
    loading,
    error,
  } = useEquipmentData();

  const [mergedData, setMergedData] = useState<MergedEquipment[]>([]);

  useEffect(() => {
    if (!loading && !error) {
      const merged = equipmentMerge(
        equipmentData,
        equipmentModelData,
        equipmentPositionHistoryData,
        equipmentStateHistoryData
      );
      setMergedData(merged);
    }
  }, [
    loading,
    error,
    equipmentData,
    equipmentModelData,
    equipmentPositionHistoryData,
    equipmentStateHistoryData,
  ]);

  return { mergedData, loading, error };
};
