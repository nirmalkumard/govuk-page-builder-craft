
import React from 'react';
import GovUKHeader from './GovUKHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <GovUKHeader />
      <main className="h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
