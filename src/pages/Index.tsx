
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from '../components/Layout';
import PageBuilderWithChat from '../components/PageBuilderWithChat';

const Index = () => {
  return (
    <Layout>
      <DndProvider backend={HTML5Backend}>
        <PageBuilderWithChat />
      </DndProvider>
    </Layout>
  );
};

export default Index;
