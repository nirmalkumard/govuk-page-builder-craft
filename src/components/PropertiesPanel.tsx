
import React, { useState, useEffect } from 'react';
import { usePageStore } from '../store/pageStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const PropertiesPanel = () => {
  const { selectedComponent, updateComponent } = usePageStore();
  const [localProps, setLocalProps] = useState(selectedComponent?.props || {});

  useEffect(() => {
    setLocalProps(selectedComponent?.props || {});
  }, [selectedComponent]);

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-4xl mb-3">⚙️</div>
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  const handleChange = (key: string, value: string | boolean | string[]) => {
    setLocalProps(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateComponent(selectedComponent.id, localProps);
  };

  const handleOptionsChange = (index: number, value: string) => {
    const options = [...(localProps.options || [])];
    options[index] = value;
    handleChange('options', options);
  };

  const addOption = () => {
    const options = [...(localProps.options || []), `Option ${(localProps.options?.length || 0) + 1}`];
    handleChange('options', options);
  };

  const removeOption = (index: number) => {
    const options = [...(localProps.options || [])];
    options.splice(index, 1);
    handleChange('options', options);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <div className="border-b pb-3 mb-4">
        <h3 className="font-medium text-gray-900 capitalize">{selectedComponent.type}</h3>
        <p className="text-sm text-gray-600">Component ID: {selectedComponent.id}</p>
      </div>

      {selectedComponent.type === 'button' && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="text">Button Text</Label>
            <Input
              id="text"
              value={localProps.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Button"
            />
          </div>
        </div>
      )}

      {(selectedComponent.type === 'input' || selectedComponent.type === 'textarea') && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={localProps.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Label"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={localProps.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="field-name"
            />
          </div>
          <div>
            <Label htmlFor="hint">Hint Text</Label>
            <Textarea
              id="hint"
              value={localProps.hint || ''}
              onChange={(e) => handleChange('hint', e.target.value)}
              placeholder="Optional hint text"
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={localProps.required || false}
              onCheckedChange={(checked) => handleChange('required', !!checked)}
            />
            <Label htmlFor="required">Required field</Label>
          </div>
        </div>
      )}

      {(selectedComponent.type === 'radios' || selectedComponent.type === 'checkboxes') && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={localProps.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Select an option"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={localProps.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="field-name"
            />
          </div>
          <div>
            <Label htmlFor="hint">Hint Text</Label>
            <Textarea
              id="hint"
              value={localProps.hint || ''}
              onChange={(e) => handleChange('hint', e.target.value)}
              placeholder="Optional hint text"
              rows={2}
            />
          </div>
          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {(localProps.options || []).map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionsChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addOption}>
                Add Option
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <Button onClick={handleSave} className="w-full">
          Update Component
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
