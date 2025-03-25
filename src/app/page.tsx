import React from 'react';
import 'leaflet/dist/leaflet.css';
import LazyMap from './components/LazyMap';

export default function Home() {
  return (
    <div>
      <LazyMap />
    </div>
  );
}
