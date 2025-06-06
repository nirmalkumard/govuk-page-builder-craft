
import React from 'react';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

const PageBuilder = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Component Library */}
      <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-900">Components</h2>
          <p className="text-sm text-gray-600 mt-1">Drag components to the canvas</p>
        </div>
        <ComponentLibrary />
      </div>

      {/* Center Panel - Canvas */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="p-4 border-b border-gray-300 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Page Canvas</h2>
          <p className="text-sm text-gray-600 mt-1">Preview your GOV.UK page</p>
        </div>
        <Canvas />
      </div>

      {/* Right Panel - Properties */}
      <div className="w-80 bg-white border-l border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-600 mt-1">Configure selected component</p>
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default PageBuilder;
