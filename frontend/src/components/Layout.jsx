import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, just show content without sidebar
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
