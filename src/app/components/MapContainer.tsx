'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Configuração do ícone do marcador (corrige um bug do Leaflet no React)
const customIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapConatiner: React.FC = () => {
  const position: [number, number] = [-23.55052, -46.633308]; // Exemplo: São Paulo

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      {/* Camada do mapa */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marcador no mapa */}
      <Marker position={position} icon={customIcon}>
        <Popup>Equipamento em São Paulo</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapConatiner;
