'use client';
import React, { useState, useEffect } from 'react';

const LazyMap = () => {
  const [MapComponent, setMapComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    import('./MapContainer').then((mod) => setMapComponent(() => mod.default));
  }, []);

  return MapComponent ? <MapComponent /> : <p>Carregando mapa...</p>;
};

export default LazyMap;
