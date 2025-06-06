
import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableComponentProps {
  type: string;
  label: string;
  description: string;
  icon: string;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, label, description, icon }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-300 rounded-md cursor-move hover:bg-blue-50 hover:border-blue-300 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{label}</h3>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ComponentLibrary = () => {
  const components = [
    {
      type: 'button',
      label: 'Button',
      description: 'GOV.UK styled button component',
      icon: '🔘',
    },
    {
      type: 'input',
      label: 'Text Input',
      description: 'Single line text input field',
      icon: '📝',
    },
    {
      type: 'textarea',
      label: 'Textarea',
      description: 'Multi-line text input area',
      icon: '📄',
    },
    {
      type: 'radios',
      label: 'Radio Buttons',
      description: 'Single selection from options',
      icon: '⚪',
    },
    {
      type: 'checkboxes',
      label: 'Checkboxes',
      description: 'Multiple selection options',
      icon: '☑️',
    },
  ];

  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      {components.map((component) => (
        <DraggableComponent
          key={component.type}
          type={component.type}
          label={component.label}
          description={component.description}
          icon={component.icon}
        />
      ))}
    </div>
  );
};

export default ComponentLibrary;
