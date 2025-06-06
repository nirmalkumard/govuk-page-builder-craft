
import { create } from 'zustand';

export interface PageComponent {
  id: string;
  type: 'button' | 'input' | 'textarea' | 'radios' | 'checkboxes';
  props: Record<string, any>;
}

interface PageStore {
  components: PageComponent[];
  selectedComponent: PageComponent | null;
  addComponent: (component: Omit<PageComponent, 'id'>) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
  selectComponent: (component: PageComponent | null) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  clearComponents: () => void;
}

export const usePageStore = create<PageStore>((set, get) => ({
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
      components: state.components.filter((comp) => comp.id !== id),
      selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
    }));
  },
  
  updateComponent: (id, props) => {
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp
      ),
      selectedComponent: state.selectedComponent?.id === id 
        ? { ...state.selectedComponent, props: { ...state.selectedComponent.props, ...props } }
        : state.selectedComponent,
    }));
  },
  
  selectComponent: (component) => {
    set({ selectedComponent: component });
  },
  
  moveComponent: (fromIndex, toIndex) => {
    set((state) => {
      const components = [...state.components];
      const [moved] = components.splice(fromIndex, 1);
      components.splice(toIndex, 0, moved);
      return { components };
    });
  },

  clearComponents: () => {
    set({ components: [], selectedComponent: null });
  },
}));
