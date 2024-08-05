// AuthenticatedLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NewNavbar from '../components/Navbar/NewNavbar';
import Groups from '../components/Groups/Groups';
import Bottom from '../components/Navbar/BottomBar';
import { groups } from '../data/Groups';

const AuthenticatedLayout: React.FC = () => {
  return (
   
  <main className="flex h-screen w-full items-center justify-center bg-black pr-4 py-2">
      <div className="grid h-full w-full grid-cols-12 grid-rows-12 gap-2 text-neutral">
        <div className="mx-3 col-span-1 row-span-3 rounded-xl bg-gradient-to-tr from-primary to-secondary">
          <NewNavbar />
        </div>
        <div className="col-span-11 row-span-12 bg-gradient-to-r from-primary to-secondary rounded-3xl">
          <Outlet />
        </div>
        <div className="mx-3 col-span-1 row-span-6 rounded-xl bg-gradient-to-tr from-primary to-secondary">
          <Groups groups={groups} />
        </div>
        <div className="mx-3 col-span-1 row-span-3 rounded-xl bg-gradient-to-tr from-primary to-secondary">
          <Bottom />
        </div>
      </div>
    </main>
  );
};

export default AuthenticatedLayout;
