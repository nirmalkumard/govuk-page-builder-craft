
import React from 'react';
import { useDrop } from 'react-dnd';
import { usePageStore } from '../store/pageStore';
import CanvasComponent from './CanvasComponent';

const Canvas = () => {
  const { components, addComponent } = usePageStore();

  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string }) => {
      const defaultProps = {
        button: { text: 'Button' },
        input: { label: 'Label', name: 'input-field' },
        textarea: { label: 'Label', name: 'textarea-field' },
        radios: { label: 'Select an option', name: 'radio-group', options: ['Option 1', 'Option 2'] },
        checkboxes: { label: 'Select options', name: 'checkbox-group', options: ['Option 1', 'Option 2'] },
      };

      addComponent({
        type: item.type,
        props: defaultProps[item.type as keyof typeof defaultProps] || {},
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex-1 p-6 overflow-y-auto ${
        isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'bg-white'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {components.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components yet</h3>
            <p className="text-gray-600">
              Drag components from the library to start building your GOV.UK page
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {components.map((component, index) => (
              <CanvasComponent
                key={component.id}
                component={component}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
