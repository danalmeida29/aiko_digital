export interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
}

export interface HourlyEarning {
  equipmentStateId: string;
  value: number;
}

export interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: HourlyEarning[];
}

export interface Position {
  date: string;
  lat: number;
  lon: number;
}

export interface EquipmentPositionHistory {
  equipmentId: string;
  positions: Position[];
}

export interface State {
  date: string;
  equipmentStateId: string;
}

export interface EquipmentStateHistory {
  equipmentId: string;
  states: State[];
}

export interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

export interface MergedEquipment {
  id: string;
  equipmentModelId: string;
  name: string;
  modelName: string;
  hourlyEarnings: HourlyEarning[];
  positions: Position[] | undefined;
  stateHistory: EquipmentStateHistory[];
}


//----------------------------------

interface StateData {
  date: string;
}

interface NewEquipmentState {
  equipmentStateId: string;
  [key: string]: StateData[];
}
