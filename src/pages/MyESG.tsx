import React from 'react';
import { Outlet } from 'react-router-dom';
import ESGSidebar from '../components/ESGSidebar';

const MyESG = () => (
  <div className="flex min-h-screen">
    <ESGSidebar />
    <main className="flex-1 p-8">
      <Outlet />
    </main>
  </div>
);

export default MyESG; 