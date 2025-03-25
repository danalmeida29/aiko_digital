'use client'
import React from 'react';
import 'leaflet/dist/leaflet.css';
import { Sidebar } from './components/Drawer';
import LazyMap from './components/LazyMap';

export default function Home() {

  return (
    <div className="flex h-screen h-full w-full">
      <div className="col-span-4 h-full w-1/4">
          <Sidebar /> 
      </div>
      <div className=" felx-col col-span-3 h-full w-3/4">
        <LazyMap />
      </div>
    </div>
  );
}
