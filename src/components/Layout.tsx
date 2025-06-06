
import React from 'react';
import GovUKHeader from './GovUKHeader';
import GovUKFooter from './GovUKFooter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <GovUKHeader />
      <main className="flex-1 pb-8">
        {children}
      </main>
      <GovUKFooter />
    </div>
  );
};

export default Layout;
