
import React from 'react';
import { useDrop } from 'react-dnd';
import { usePageStore } from '../store/pageStore';
import CanvasComponent from './CanvasComponent';
import GovUKHeader from './GovUKHeader';
import GovUKFooter from './GovUKFooter';

const Canvas = () => {
  const { components, addComponent } = usePageStore();

  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string }) => {
      const newComponent = {
        id: Date.now().toString(),
        type: item.type,
        props: getDefaultProps(item.type),
      };
      addComponent(newComponent);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const getDefaultProps = (type: string) => {
    switch (type) {
      case 'button':
        return { text: 'Button', variant: 'primary' };
      case 'input':
        return { label: 'Input Label', placeholder: 'Enter text', required: false };
      case 'textarea':
        return { label: 'Textarea Label', placeholder: 'Enter text', required: false };
      case 'radios':
        return { label: 'Select an option', options: ['Option 1', 'Option 2'], required: false };
      case 'checkboxes':
        return { label: 'Select options', options: ['Option 1', 'Option 2'], required: false };
      default:
        return {};
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Preview Header */}
      <div className="bg-white border-b">
        <GovUKHeader />
      </div>
      
      {/* Canvas Content Area */}
      <div 
        ref={drop}
        className={`flex-1 overflow-auto bg-white p-8 ${
          isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
        }`}
      >
        <div className="govuk-width-container">
          <main className="govuk-main-wrapper" id="main-content" role="main">
            {components.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg mb-2">Drag components here to start building your page</p>
                <p className="text-sm">Components will appear in the preview as you add them</p>
              </div>
            ) : (
              <div className="space-y-6">
                {components.map((component) => (
                  <CanvasComponent key={component.id} component={component} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Preview Footer */}
      <div className="bg-white border-t">
        <GovUKFooter />
      </div>
    </div>
  );
};

export default Canvas;
