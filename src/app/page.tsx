'use client';
import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';

import LazyMap from './components/LazyMap';
import { Sidebar } from './components/Sidebar';
import { TableComponent } from './components/TableStates';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex sm:flex-row h-screen w-full">
      <div className="col-span-4 h-full w-[58px] z-50">
        <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedFilter={setSelectedFilter}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>
      <div className=" ml-0 felx-col col-span-3 h-full w-full z-10">
        <div className="grid-col h-full">
          <LazyMap
            searchTerm={searchTerm}
            selectedFilter={selectedFilter}
            startDate={startDate}
            endDate={endDate}
          />
          <div className=" flex-row">
            <TableComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
