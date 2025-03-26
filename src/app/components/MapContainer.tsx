'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { StatusIcon } from './StatusIcon';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card } from './Card';
import { useMergedEquipmentData } from '../hooks/useMergedEquipmentData';
import { formatDate, getStatusName } from '../utils/functionsUtils';

interface Marker {
  id: string;
  name: string;
  modelName: string;
  status: string;
  position: [number, number];
  date: string;
  statusAtual: string;
}

const MapConatiner: React.FC = () => {
  const listItems = [
    {
      text: 'Operando',
      icon: (
        <StatusIcon
          statusId={'0808344c-454b-4c36-89e8-d7687e692d57'}
          width={15}
          height={15}
        />
      ),
    },
    {
      text: 'Parado',
      icon: (
        <StatusIcon
          statusId={'baff9783-84e8-4e01-874b-6fd743b875ad'}
          width={15}
          height={15}
        />
      ),
    },
    {
      text: 'Manutenção',
      icon: (
        <StatusIcon
          statusId={'03b2d446-e3ba-4c82-8dc2-a5611fea6e1f'}
          width={15}
          height={15}
        />
      ),
    },
  ];

  const { mergedData, loading, error } = useMergedEquipmentData();

  const [markers, setMarkers] = useState<Marker[]>([]);

  const getLatestPosition = (
    positions?: { date: string; lat: number; lon: number }[]
  ) => {
    if (!positions || positions.length === 0) {
      return null;
    }
    const latestPosition = positions.reduce((latest, current) => {
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    });
    // console.log("Última posição encontrada:", latestPosition);
    return latestPosition;
  };

  useEffect(() => {
    if (!loading && mergedData.length > 0) {
      const updatedMarkers = mergedData
        .map((equipment) => {
          const latestPosition = getLatestPosition(equipment.positions);

          if (!latestPosition) return null;

          // Encontra o status correspondente
          const status = equipment.stateHistory?.[0];
          let stateId = null;
          let statusAtual =
            'Sem dados sobre a localização atual do equipamento.';
          let ultimaDataEstados = null;

          if (status?.states) {
            // Verifica se existe um estado com a mesma data
            const matchingState = status.states.find(
              (state) => state.date === latestPosition.date
            );

            if (matchingState) {
              stateId = matchingState.equipmentStateId;
              statusAtual = getStatusName(stateId);
            } else {
              const latestState = status.states.reduce((latest, current) =>
                new Date(current.date) > new Date(latest.date)
                  ? current
                  : latest
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
            status: stateId || '', // Adiciona o stateId aqui
            position: [latestPosition.lat, latestPosition.lon],
            date: latestPosition.date,
            statusAtual,
          };
        })
        .filter((marker) => marker !== null) as Marker[];

      console.log('Marcadores com stateId:', updatedMarkers);
      setMarkers(updatedMarkers);
    }
  }, [mergedData, loading, error]);

  const position: [number, number] = [-14.235, -51.9253];

  /**
   * customização dos icones
   */
  const customIcon = (statusId: string) =>
    new L.DivIcon({
      className: 'custom-marker-icon',
      html: renderToStaticMarkup(<StatusIcon statusId={statusId} />),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

  return (
    <div className="relative w-full h-[500px]">
      <MapContainer
        center={position}
        zoom={5}
        className="absolute inset-0 z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={customIcon(marker.status)}
          >
            <Popup>
              <div>
                <strong>Equipamento:</strong> {marker.name}
                <br />
                <strong>Modelo:</strong> {marker.modelName}
                <br />
                <strong>Status:</strong> {marker.statusAtual} <br />
                <strong>Data da última Posição registrada:</strong>{' '}
                {formatDate(marker.date)}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-2 left-2 p-2 z-50">
        <Card listItems={listItems} size="w-40 p-4" fontSize="text-sm" />
      </div>
    </div>
  );
};

export default MapConatiner;
