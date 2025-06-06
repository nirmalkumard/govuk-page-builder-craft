
import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { usePageStore } from '../store/pageStore';
import CanvasComponent from './CanvasComponent';
import GovUKHeader from './GovUKHeader';
import GovUKFooter from './GovUKFooter';

const Canvas = () => {
  const { components, addComponent } = usePageStore();

  // Debug component changes
  useEffect(() => {
    console.log('🎨 Canvas: Components updated, count:', components.length);
    console.log('🎨 Canvas: Current components:', components);
  }, [components]);

  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: 'button' | 'input' | 'textarea' | 'radios' | 'checkboxes' }) => {
      console.log('🎯 Canvas: Component dropped from library:', item.type);
      const newComponent = {
        type: item.type,
        props: getDefaultProps(item.type),
      };
      addComponent(newComponent);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const getDefaultProps = (type: 'button' | 'input' | 'textarea' | 'radios' | 'checkboxes') => {
    switch (type) {
      case 'button':
        return { text: 'Button', variant: 'primary' };
      case 'input':
        return { label: 'Input Label', placeholder: 'Enter text', required: false, name: 'input-field' };
      case 'textarea':
        return { label: 'Textarea Label', placeholder: 'Enter text', required: false, name: 'textarea-field' };
      case 'radios':
        return { label: 'Select an option', options: ['Option 1', 'Option 2'], required: false, name: 'radio-group' };
      case 'checkboxes':
        return { label: 'Select options', options: ['Option 1', 'Option 2'], required: false, name: 'checkbox-group' };
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
                <p className="text-sm mb-4">Components will appear in the preview as you add them</p>
                <div className="text-xs bg-gray-100 p-3 rounded border">
                  <p className="font-medium mb-1">💡 Try using the AI chatbot:</p>
                  <p>"Create a contact form"</p>
                  <p>"Add a feedback survey"</p>
                  <p>"Build an application form"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
                  📊 Debug: {components.length} component{components.length !== 1 ? 's' : ''} on page
                </div>
                {components.map((component, index) => {
                  console.log(`🔄 Canvas: Rendering component ${index}:`, component);
                  return (
                    <CanvasComponent key={component.id} component={component} index={index} />
                  );
                })}
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
