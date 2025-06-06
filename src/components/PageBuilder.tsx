
import React from 'react';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

const PageBuilder = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Component Library (Minimized) */}
      <div className="w-60 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-3 border-b border-gray-300">
          <h2 className="text-base font-bold text-gray-900">Components</h2>
          <p className="text-xs text-gray-600 mt-1">Drag to canvas</p>
        </div>
        <ComponentLibrary />
      </div>

      {/* Center Panel - Canvas (Maximized) */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="p-4 border-b border-gray-300 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Page Canvas</h2>
          <p className="text-sm text-gray-600 mt-1">Preview your GOV.UK page</p>
        </div>
        <Canvas />
      </div>

      {/* Right Panel - Properties (Minimized) */}
      <div className="w-60 bg-white border-l border-gray-300 flex flex-col">
        <div className="p-3 border-b border-gray-300">
          <h2 className="text-base font-bold text-gray-900">Properties</h2>
          <p className="text-xs text-gray-600 mt-1">Configure component</p>
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default PageBuilder;
