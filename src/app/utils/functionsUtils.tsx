import { MergedEquipment } from "../hooks/equipmentTypes";

interface Marker {
  id: string;
  name: string;
  modelName: string;
  status: string;
  position: [number, number];
  date: string;
  statusAtual: string;
}

export const formatDate = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  return `${date.getUTCDate().toString().padStart(2, '0')}/${(
    date.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, '0')}/${date.getUTCFullYear()} ás ${date.getUTCHours().toString().padStart(2, '0')}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}h`;
};

export const getStatusName = (id: string): string => {
  const statusMap: Record<string, string> = {
    '0808344c-454b-4c36-89e8-d7687e692d57': 'Operando',
    'baff9783-84e8-4e01-874b-6fd743b875ad': 'Parado',
    '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f': 'Manutenção',
  };

  return statusMap[id] ?? 'Status desconhecido';
};

export const getLatestPosition = (positions?: { date: string; lat: number; lon: number }[]) => {
  if (!positions || positions.length === 0) {
    return null;
  }
  return positions.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  });
};

export const filterMarkers = (
  markers: Marker[], 
  searchTerm: string, 
  selectedFilter: string[], 
  startDate?: Date, 
  endDate?: Date
) => {
  return markers.filter((marker) => {
    const matchesSearch =
      marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marker.modelName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedFilter.length === 0 ||
      selectedFilter.some((filter) => {
        switch (filter) {
          case 'operando':
            return marker.status === '0808344c-454b-4c36-89e8-d7687e692d57';
          case 'parado':
            return marker.status === 'baff9783-84e8-4e01-874b-6fd743b875ad';
          case 'manutencao':
            return marker.status === '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f';
          default:
            return false;
        }
      });

    const markerDate = new Date(marker.date);
    const matchesDate =
      (!startDate && !endDate) ||
      (startDate && !endDate && markerDate.toDateString() === startDate.toDateString()) ||
      (startDate && endDate && markerDate >= startDate && markerDate <= endDate);

    return matchesSearch && matchesStatus && matchesDate;
  });
};

export const processEquipment = (equipment: MergedEquipment) => {
  const latestPosition = getLatestPosition(equipment.positions);
  if (!latestPosition) return null;

  // Encontra o status correspondente
  const status = equipment.stateHistory?.[0];
  let stateId = null;
  let statusAtual = 'Sem dados sobre a localização atual do equipamento.';
  let ultimaDataEstados = null;

  if (status?.states) {
    const matchingState = status.states.find(
      (state) => state.date === latestPosition.date
    );

    if (matchingState) {
      stateId = matchingState.equipmentStateId;
      statusAtual = getStatusName(stateId);
    } else {
      const latestState = status.states.reduce((latest, current) =>
        new Date(current.date) > new Date(latest.date) ? current : latest
      );

      if (latestState) {
        stateId = latestState.equipmentStateId;
        ultimaDataEstados = latestState.date;
        statusAtual += ` Último estado registrado foi como: ${getStatusName(stateId)} em ${formatDate(ultimaDataEstados)} `;
      }
    }
  }

  return {
    id: equipment.id,
    name: equipment.name,
    modelName: equipment.modelName,
    status: stateId || '',
    position: [latestPosition.lat, latestPosition.lon],
    date: latestPosition.date,
    statusAtual,
  };
};