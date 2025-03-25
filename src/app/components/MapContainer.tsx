'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { StatusIcon } from './StatusIcon';
import { renderToStaticMarkup } from 'react-dom/server';


const MapConatiner: React.FC = () => {
  const position: [number, number] = [-23.55052, -46.633308]; // Exemplo: São Paulo
  const statusId = '0808344c-454b-4c36-89e8-d7687e692d57';

  // Configuração do ícone do marcador (corrige um bug do Leaflet no React)
  const customIcon = new L.DivIcon({
    className: 'custom-marker-icon',
    html: renderToStaticMarkup(<StatusIcon statusId={statusId} />),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      {/* Camada do mapa */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marcador no mapa */}
      <Marker position={position} icon={customIcon}>
        <Popup>Equipamento em São Paulo</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapConatiner;
