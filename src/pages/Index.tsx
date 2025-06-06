
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PageBuilder from '../components/PageBuilder';

const Index = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <PageBuilder />
      </div>
    </DndProvider>
  );
};

export default Index;
