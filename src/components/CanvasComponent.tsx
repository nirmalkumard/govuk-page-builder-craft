
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import { usePageStore, PageComponent } from '../store/pageStore';
import { Button } from '@/components/ui/button';

interface CanvasComponentProps {
  component: PageComponent;
  index: number;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ component, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { removeComponent, selectComponent, selectedComponent, moveComponent } = usePageStore();

  console.log('🎭 CanvasComponent: Rendering component:', component.type, component.id);

  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-component',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'canvas-component',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveComponent(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  const isSelected = selectedComponent?.id === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component);
    console.log('👆 CanvasComponent: Selected component:', component.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
    console.log('🗑️ CanvasComponent: Deleted component:', component.id);
  };

  const renderComponent = () => {
    const { type, props } = component;
    console.log('🎨 CanvasComponent: Rendering', type, 'with props:', props);

    try {
      switch (type) {
        case 'button':
          return (
            <button className="bg-green-600 text-white py-2 px-4 font-bold border-none cursor-pointer hover:bg-green-700 rounded">
              {props.text || 'Button'}
            </button>
          );

        case 'input':
          return (
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-gray-900">
                {props.label || 'Label'}
                {props.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              {props.hint && (
                <div className="text-gray-600 text-sm mb-2">{props.hint}</div>
              )}
              <input
                type="text"
                className="border-2 border-gray-900 p-2 w-full text-lg max-w-md"
                name={props.name || 'input'}
                placeholder={props.placeholder}
                required={props.required}
                readOnly
              />
            </div>
          );

        case 'textarea':
          return (
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-gray-900">
                {props.label || 'Label'}
                {props.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              {props.hint && (
                <div className="text-gray-600 text-sm mb-2">{props.hint}</div>
              )}
              <textarea
                className="border-2 border-gray-900 p-2 w-full text-lg max-w-md"
                rows={5}
                name={props.name || 'textarea'}
                placeholder={props.placeholder}
                required={props.required}
                readOnly
              />
            </div>
          );

        case 'radios':
          const radioOptions = Array.isArray(props.options) ? props.options : ['Option 1', 'Option 2'];
          return (
            <div className="mb-4">
              <fieldset>
                <legend className="text-lg font-bold mb-3 text-gray-900">
                  {props.label || 'Select an option'}
                  {props.required && <span className="text-red-600 ml-1">*</span>}
                </legend>
                {props.hint && (
                  <div className="text-gray-600 text-sm mb-3">{props.hint}</div>
                )}
                <div className="space-y-2">
                  {radioOptions.map((option, idx) => (
                    <div key={idx} className="flex items-center">
                      <input
                        type="radio"
                        name={props.name || component.id}
                        value={option}
                        className="mr-3 w-4 h-4"
                        disabled
                      />
                      <label className="text-lg text-gray-900">{option}</label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          );

        case 'checkboxes':
          const checkboxOptions = Array.isArray(props.options) ? props.options : ['Option 1', 'Option 2'];
          return (
            <div className="mb-4">
              <fieldset>
                <legend className="text-lg font-bold mb-3 text-gray-900">
                  {props.label || 'Select options'}
                  {props.required && <span className="text-red-600 ml-1">*</span>}
                </legend>
                {props.hint && (
                  <div className="text-gray-600 text-sm mb-3">{props.hint}</div>
                )}
                <div className="space-y-2">
                  {checkboxOptions.map((option, idx) => (
                    <div key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        name={`${props.name || component.id}[]`}
                        value={option}
                        className="mr-3 w-4 h-4"
                        disabled
                      />
                      <label className="text-lg text-gray-900">{option}</label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          );

        default:
          console.warn('⚠️ CanvasComponent: Unknown component type:', type);
          return (
            <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
              Unknown component type: {type}
            </div>
          );
      }
    } catch (error) {
      console.error('❌ CanvasComponent: Error rendering component:', error);
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          Error rendering {type} component
        </div>
      );
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      } ${isDragging ? 'opacity-50' : ''} p-3 rounded border`}
    >
      {renderComponent()}
      
      {isSelected && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {/* Debug info for development */}
      <div className="absolute bottom-1 left-1 text-xs text-gray-400 bg-white px-1 rounded opacity-50">
        {component.type}#{component.id.slice(-4)}
      </div>
    </div>
  );
};

export default CanvasComponent;
