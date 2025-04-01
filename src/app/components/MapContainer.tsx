'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { StatusIcon } from './StatusIcon';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card } from './Card';
import { useMergedEquipmentData } from '../hooks/useMergedEquipmentData';
import {
  filterMarkers,
  formatDate,
  processEquipment,
} from '../utils/functionsUtils';
import { useSelectedId } from '../context/SelectedIdContext';

interface Marker {
  id: string;
  name: string;
  modelName: string;
  status: string;
  position: [number, number];
  date: string;
  statusAtual: string;
}

interface Props {
  searchTerm: string;
  selectedFilter: string[];
  startDate?: Date;
  endDate?: Date;
}

const MapConatiner: React.FC<Props> = ({
  searchTerm,
  selectedFilter,
  startDate,
  endDate,
}) => {
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
  const { getEquipmentData } = useSelectedId();
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    if (!loading && mergedData.length > 0) {
      const updatedMarkers = mergedData
        .map((equipment) => processEquipment(equipment))
        .filter((marker) => marker !== null) as Marker[];

      setMarkers(updatedMarkers);
    }
  }, [mergedData, loading, error]);

  const filteredMarkers = filterMarkers(
    markers,
    searchTerm,
    selectedFilter,
    startDate,
    endDate
  );
  const position: [number, number] = [-14.235, -51.9253];

  /**
   * customizaÃ§Ã£o dos icones
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
    <div className="relative w-full h-1/2">
      <MapContainer
        center={position}
        zoom={5}
        className="absolute inset-0 z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={customIcon(marker.status)}
            eventHandlers={{
              click: () => getEquipmentData(marker.id),
            }}
          >
            <Popup>
              <div>
                <strong>Equipamento:</strong> {marker.name}
                <br />
                <strong>Modelo:</strong> {marker.modelName}
                <br />
                <strong>Status:</strong> {marker.statusAtual} <br />
                <strong>Data da última posição registrada:</strong>{' '}
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
