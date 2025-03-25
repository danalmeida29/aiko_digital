'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { StatusIcon } from './StatusIcon';
import { renderToStaticMarkup } from 'react-dom/server';
import { Card } from './Card';


const MapConatiner: React.FC = () => {
  const listItems = [
    { text: 'Operando', icon: <StatusIcon statusId={'0808344c-454b-4c36-89e8-d7687e692d57'} width={15} height={15} /> },
    { text: 'Parado', icon: <StatusIcon statusId={'baff9783-84e8-4e01-874b-6fd743b875ad'} width={15} height={15} /> },
    { text: 'Manutenção', icon: <StatusIcon statusId={'03b2d446-e3ba-4c82-8dc2-a5611fea6e1f'} width={15} height={15} /> },
  ];

  const position: [number, number] = [-23.55052, -46.633308]; 
  const statusId = '0808344c-454b-4c36-89e8-d7687e692d57';

  
  const customIcon = new L.DivIcon({
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
        zoom={13}
        className="absolute inset-0 z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <Marker position={position} icon={customIcon}>
          <Popup>Equipamento em São Paulo</Popup>
        </Marker>
      </MapContainer>

      <div className="absolute bottom-2 left-2 p-2 z-50">
        <Card listItems={listItems} size="w-40 p-4" fontSize="text-sm" />
      </div>
    </div>
  );
};

export default MapConatiner;
