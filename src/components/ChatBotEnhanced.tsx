
import React, { useState } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePageStore } from '../store/pageStore';
import { AnthropicService } from '../services/anthropicService';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'success' | 'error' | 'warning';
}

interface ComponentConfig {
  type: 'button' | 'input' | 'textarea' | 'radios' | 'checkboxes';
  props: Record<string, any>;
}

const ChatBotEnhanced = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI-powered GOV.UK page builder using Claude AI. I can create forms, surveys, and pages using the official GOV.UK Design System. Try asking me to 'Create a contact form' or 'Build a feedback survey'.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('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');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [lastApiStatus, setLastApiStatus] = useState<'success' | 'failed' | 'unknown'>('unknown');
  const { addComponent, clearComponents, components } = usePageStore();
  const { toast } = useToast();

  const processWithAI = async (prompt: string): Promise<ComponentConfig[]> => {
    if (!apiKey) {
      throw new Error('API key not provided');
    }

    console.log('🤖 Attempting Anthropic API call with prompt:', prompt);
    const anthropicService = new AnthropicService(apiKey);
    
    try {
      const response = await anthropicService.generateGovUKComponents(prompt);
      console.log('🤖 Anthropic API response:', response);
      
      const parsed = JSON.parse(response);
      console.log('🤖 Parsed components:', parsed);
      
      setLastApiStatus('success');
      toast({
        title: "✅ Anthropic API Success",
        description: "Components generated using Claude AI",
      });
      
      return parsed;
    } catch (error) {
      console.error('🤖 Anthropic API failed:', error);
      setLastApiStatus('failed');
      
      toast({
        title: "❌ Anthropic API Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const fallbackProcessing = (prompt: string): ComponentConfig[] => {
    console.log('🔄 Using fallback processing for:', prompt);
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
        { type: 'textarea', props: { label: 'Additional comments', name: 'comments', placeholder: 'Please provide any additional feedback' } },
        { type: 'button', props: { text: 'Submit feedback', variant: 'primary' } }
      ];
    }

    if (lowerPrompt.includes('application form')) {
      return [
        { type: 'input', props: { label: 'First name', name: 'first-name', required: true } },
        { type: 'input', props: { label: 'Last name', name: 'last-name', required: true } },
        { type: 'input', props: { label: 'Date of birth', name: 'dob', required: true, placeholder: 'DD/MM/YYYY' } },
        { type: 'textarea', props: { label: 'Why are you applying?', name: 'reason', required: true } },
        { type: 'button', props: { text: 'Submit application', variant: 'primary' } }
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
      let messageType: 'success' | 'error' | 'warning' = 'success';

      // Clear existing components for new builds
      if (inputValue.toLowerCase().includes('create') || inputValue.toLowerCase().includes('build')) {
        clearComponents();
      }

      try {
        // Try AI generation first
        componentsToAdd = await processWithAI(inputValue);
        botResponse = `✅ I've created ${componentsToAdd.length} GOV.UK components using Claude AI. The components follow the official Design System guidelines.`;
        messageType = 'success';
      } catch (error) {
        console.warn('🔄 AI processing failed, using fallback:', error);
        
        // Fallback to rule-based processing
        componentsToAdd = fallbackProcessing(inputValue);
        
        if (componentsToAdd.length > 0) {
          botResponse = `⚠️ Anthropic API failed, but I've created ${componentsToAdd.length} components using the fallback system. The API error was: ${error instanceof Error ? error.message : 'Unknown error'}`;
          messageType = 'warning';
        } else {
          botResponse = `❌ Both Anthropic API and fallback failed. API error: ${error instanceof Error ? error.message : 'Unknown error'}. Try asking for specific things like "Create a contact form" or "Build a feedback survey".`;
          messageType = 'error';
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
        type: messageType,
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error('❌ Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ Critical error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your API configuration.`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
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

  const getStatusIcon = () => {
    switch (lastApiStatus) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bot className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (lastApiStatus) {
      case 'success':
        return 'Claude AI Active';
      case 'failed':
        return 'Using Fallback';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
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
        <p className="text-sm text-gray-600 mt-1">Claude AI-powered GOV.UK component generation</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">Components: {components.length}</p>
          <p className="text-xs text-gray-500">Status: {getStatusText()}</p>
        </div>
        
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
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-900 border border-red-200'
                    : message.type === 'warning'
                    ? 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                    : message.type === 'success'
                    ? 'bg-green-100 text-green-900 border border-green-200'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    message.type === 'error' ? <XCircle className="w-4 h-4 mt-1 flex-shrink-0" /> :
                    message.type === 'warning' ? <AlertTriangle className="w-4 h-4 mt-1 flex-shrink-0" /> :
                    message.type === 'success' ? <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" /> :
                    <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Generating with Claude AI...</p>
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
          <p className="text-xs text-gray-500">Production testing mode - Claude AI with fallback system</p>
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
