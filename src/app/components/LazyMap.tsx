'use client';
import React, { useState, useEffect } from 'react';
interface Props {
  searchTerm: string;
  selectedFilter: string[];
  startDate?: Date;
  endDate?: Date;
}
const LazyMap = ({ searchTerm, selectedFilter, startDate, endDate }: Props) => {
  const [MapComponent, setMapComponent] = useState<React.FC<Props> | null>(
    null
  );

  useEffect(() => {
    import('./MapContainer').then((mod) =>
      setMapComponent(() => mod.default as React.FC<Props>)
    );
  }, []);

  return MapComponent ? (
    <MapComponent
      searchTerm={searchTerm}
      selectedFilter={selectedFilter}
      startDate={startDate}
      endDate={endDate}
    />
  ) : (
    <p>Carregando mapa...</p>
  );
};

export default LazyMap;
