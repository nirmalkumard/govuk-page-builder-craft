
import React, { useState } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePageStore } from '../store/pageStore';
import { AnthropicService } from '../services/anthropicService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ComponentConfig {
  type: 'button' | 'input' | 'textarea' | 'radios' | 'checkboxes';
  props: Record<string, any>;
}

const ChatBotEnhanced = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI-powered GOV.UK page builder. I can create forms, surveys, and pages using the official GOV.UK Design System. Try asking me to 'Create a contact form' or 'Build a feedback survey'.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('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');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { addComponent, clearComponents, components } = usePageStore();

  const processWithAI = async (prompt: string): Promise<ComponentConfig[]> => {
    if (!apiKey) {
      throw new Error('API key not provided');
    }

    const anthropicService = new AnthropicService(apiKey);
    const response = await anthropicService.generateGovUKComponents(prompt);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', response);
      throw new Error('Invalid response format from AI');
    }
  };

  const fallbackProcessing = (prompt: string): ComponentConfig[] => {
    const lowerPrompt = prompt.toLowerCase().trim();
    
    if (lowerPrompt.includes('contact form')) {
      return [
        { type: 'input', props: { label: 'Full name', name: 'full-name', required: true, placeholder: 'Enter your full name' } },
        { type: 'input', props: { label: 'Email address', name: 'email', required: true, placeholder: 'Enter your email address' } },
        { type: 'textarea', props: { label: 'Message', name: 'message', required: true, placeholder: 'Enter your message' } },
        { type: 'button', props: { text: 'Send message', variant: 'primary' } }
      ];
    }
    
    if (lowerPrompt.includes('feedback') || lowerPrompt.includes('survey')) {
      return [
        { type: 'radios', props: { 
          label: 'How satisfied were you with this service?', 
          name: 'satisfaction', 
          required: true,
          options: ['Very satisfied', 'Satisfied', 'Neither satisfied nor dissatisfied', 'Dissatisfied', 'Very dissatisfied'] 
        }},
        { type: 'button', props: { text: 'Submit feedback', variant: 'primary' } }
      ];
    }

    return [];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      let componentsToAdd: ComponentConfig[] = [];
      let botResponse = '';

      // Clear existing components for new builds
      if (inputValue.toLowerCase().includes('create') || inputValue.toLowerCase().includes('build')) {
        clearComponents();
      }

      try {
        // Try AI generation first
        componentsToAdd = await processWithAI(inputValue);
        botResponse = `✅ I've created ${componentsToAdd.length} GOV.UK components using AI. The components follow the official Design System guidelines.`;
      } catch (error) {
        console.warn('AI processing failed, using fallback:', error);
        // Fallback to rule-based processing
        componentsToAdd = fallbackProcessing(inputValue);
        
        if (componentsToAdd.length > 0) {
          botResponse = `✅ I've created ${componentsToAdd.length} components using the fallback system. For better results, please check your API connection.`;
        } else {
          botResponse = `❓ I couldn't understand your request. Try asking for specific things like "Create a contact form" or "Build a feedback survey".`;
        }
      }

      // Add components to the page
      if (componentsToAdd.length > 0) {
        componentsToAdd.forEach((component, index) => {
          setTimeout(() => {
            addComponent(component);
          }, index * 100);
        });
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "❌ Sorry, I encountered an error. Please try again or check your API configuration.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsProcessing(false);
      }, 500);
    }

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">AI Page Builder</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          >
            {showApiKeyInput ? 'Hide' : 'API'}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">AI-powered GOV.UK component generation</p>
        <p className="text-xs text-gray-500 mt-1">Components: {components.length}</p>
        
        {showApiKeyInput && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-yellow-800 mb-2">
                  ⚠️ API key is hardcoded for testing. In production, use environment variables.
                </p>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Anthropic API key"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                  {message.sender === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Generating GOV.UK components with AI...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-300 bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build..."
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSendMessage} 
            size="sm"
            disabled={isProcessing || !inputValue.trim()}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-500">Production testing mode - AI-powered generation</p>
          <div className="flex flex-wrap gap-1">
            {['Create a contact form', 'Build a feedback survey', 'Make an application form'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInputValue(prompt)}
                className="text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border text-blue-700"
                disabled={isProcessing}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotEnhanced;
