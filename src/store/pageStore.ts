
import { create } from 'zustand';

export interface ComponentProps {
  label?: string;
  name?: string;
  hint?: string;
  required?: boolean;
  text?: string;
  options?: string[];
}

export interface PageComponent {
  id: string;
  type: string;
  props: ComponentProps;
}

interface PageState {
  components: PageComponent[];
  selectedComponent: PageComponent | null;
  addComponent: (component: Omit<PageComponent, 'id'>) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, props: ComponentProps) => void;
  selectComponent: (component: PageComponent | null) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
}

export const usePageStore = create<PageState>((set, get) => ({
  components: [],
  selectedComponent: null,
  
  addComponent: (component) => {
    const newComponent = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      components: [...state.components, newComponent],
    }));
  },
  
  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
    }));
  },
  
  updateComponent: (id, props) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, ...props } } : c
      ),
      selectedComponent: state.selectedComponent?.id === id 
        ? { ...state.selectedComponent, props: { ...state.selectedComponent.props, ...props } }
        : state.selectedComponent,
    }));
  },
  
  selectComponent: (component) => {
    set({ selectedComponent: component });
  },
  
  moveComponent: (dragIndex, hoverIndex) => {
    const { components } = get();
    const dragComponent = components[dragIndex];
    const newComponents = [...components];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, dragComponent);
    set({ components: newComponents });
  },
}));
