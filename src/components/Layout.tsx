
import React from 'react';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto transition-all duration-300 animate-fade-in">
        <div className="h-full py-6 px-4 max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
