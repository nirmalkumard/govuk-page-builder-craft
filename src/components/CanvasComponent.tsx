
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
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
  };

  const renderComponent = () => {
    const { type, props } = component;

    switch (type) {
      case 'button':
        return (
          <button className="bg-green-600 text-white py-2 px-4 font-bold border-none cursor-pointer hover:bg-green-700">
            {props.text || 'Button'}
          </button>
        );

      case 'input':
        return (
          <div className="mb-4">
            <label className="block text-lg font-bold mb-1 text-gray-900">
              {props.label || 'Label'}
            </label>
            {props.hint && (
              <div className="text-gray-600 text-sm mb-2">{props.hint}</div>
            )}
            <input
              type="text"
              className="border-2 border-gray-900 p-2 w-full text-lg"
              name={props.name}
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
            </label>
            {props.hint && (
              <div className="text-gray-600 text-sm mb-2">{props.hint}</div>
            )}
            <textarea
              className="border-2 border-gray-900 p-2 w-full text-lg"
              rows={5}
              name={props.name}
              required={props.required}
              readOnly
            />
          </div>
        );

      case 'radios':
        return (
          <div className="mb-4">
            <fieldset>
              <legend className="text-lg font-bold mb-3 text-gray-900">
                {props.label || 'Select an option'}
              </legend>
              {props.hint && (
                <div className="text-gray-600 text-sm mb-3">{props.hint}</div>
              )}
              <div className="space-y-2">
                {(props.options || ['Option 1', 'Option 2']).map((option, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name={props.name || component.id}
                      value={option}
                      className="mr-3"
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
        return (
          <div className="mb-4">
            <fieldset>
              <legend className="text-lg font-bold mb-3 text-gray-900">
                {props.label || 'Select options'}
              </legend>
              {props.hint && (
                <div className="text-gray-600 text-sm mb-3">{props.hint}</div>
              )}
              <div className="space-y-2">
                {(props.options || ['Option 1', 'Option 2']).map((option, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      name={props.name || component.id}
                      value={option}
                      className="mr-3"
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
        return <div>Unknown component type</div>;
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
    </div>
  );
};

export default CanvasComponent;
