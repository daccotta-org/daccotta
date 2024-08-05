// UnauthenticatedLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const UnauthenticatedLayout: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full ">
      
      <Outlet />
    </div>
  );
};

export default UnauthenticatedLayout;
