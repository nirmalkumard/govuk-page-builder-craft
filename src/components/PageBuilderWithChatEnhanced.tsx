
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import ChatBotEnhanced from './ChatBotEnhanced';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const PageBuilderWithChatEnhanced = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Component Library */}
      <div className="w-60 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-3 border-b border-gray-300">
          <h2 className="text-base font-bold text-gray-900">Components</h2>
          <p className="text-xs text-gray-600 mt-1">Drag to canvas</p>
        </div>
        <ComponentLibrary />
      </div>

      {/* Center Panel - Canvas */}
      <div className="flex-1 flex flex-col bg-gray-100 relative">
        <div className="p-4 border-b border-gray-300 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Page Preview</h2>
          <p className="text-sm text-gray-600 mt-1">AI-powered GOV.UK page builder</p>
        </div>
        <Canvas />
        
        {/* Floating AI ChatBot Button */}
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-96 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>AI Page Builder</SheetTitle>
            </SheetHeader>
            <ChatBotEnhanced />
          </SheetContent>
        </Sheet>
      </div>

      {/* Right Panel - Properties */}
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

export default PageBuilderWithChatEnhanced;
